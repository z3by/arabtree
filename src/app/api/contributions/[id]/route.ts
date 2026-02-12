import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { auth } from '@/lib/auth'
import { hasRole } from '@/lib/rbac'
import { z } from 'zod'

// ── Valid status transitions ──
const STATUS_TRANSITIONS: Record<string, { allowed: string[]; requiredRole: string }> = {
    DRAFT: { allowed: ['PENDING', 'WITHDRAWN'], requiredRole: 'CONTRIBUTOR' },
    PENDING: { allowed: ['APPROVED', 'REJECTED', 'WITHDRAWN'], requiredRole: 'CONTRIBUTOR' },
    REJECTED: { allowed: ['PENDING', 'WITHDRAWN'], requiredRole: 'CONTRIBUTOR' },
    // Terminal states: APPROVED, WITHDRAWN — no further transitions
}

// Who can perform which transitions
const VERIFIER_TRANSITIONS = ['APPROVED', 'REJECTED']
const AUTHOR_TRANSITIONS = ['PENDING', 'WITHDRAWN']

const updateStatusSchema = z.object({
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'WITHDRAWN']),
    reviewNote: z.string().max(2000).optional(),
})

/**
 * GET /api/contributions/:id
 * Fetch a single contribution with full details.
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({ where: { id: session.user.id } })
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const contribution = await prisma.contribution.findUnique({
            where: { id },
            include: {
                author: {
                    select: { id: true, name: true, email: true, image: true },
                },
                node: {
                    select: { id: true, name: true, nameAr: true, type: true, parentId: true },
                },
                reviewer: {
                    select: { id: true, name: true },
                },
            },
        })

        if (!contribution) {
            return NextResponse.json({ error: 'Contribution not found' }, { status: 404 })
        }

        // Non-verifiers can only view their own contributions
        if (contribution.authorId !== session.user.id && !hasRole(user.role, 'VERIFIER')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        return NextResponse.json(contribution)
    } catch (error) {
        console.error('Error fetching contribution:', error)
        return NextResponse.json(
            { error: 'Failed to fetch contribution' },
            { status: 500 }
        )
    }
}

/**
 * PUT /api/contributions/:id
 * Update contribution status (state machine transitions).
 *
 * State machine:
 *   DRAFT → PENDING (author submits)
 *   PENDING → APPROVED (verifier approves)
 *   PENDING → REJECTED (verifier rejects)
 *   PENDING → WITHDRAWN (author withdraws)
 *   REJECTED → PENDING (author revises & resubmits)
 *   REJECTED → WITHDRAWN (author gives up)
 *
 * On APPROVED: applies the contribution (e.g., creates or edits a LineageNode)
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({ where: { id: session.user.id } })
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const body = await request.json()
        const { status: newStatus, reviewNote } = updateStatusSchema.parse(body)

        // Fetch the contribution
        const contribution = await prisma.contribution.findUnique({ where: { id } })
        if (!contribution) {
            return NextResponse.json({ error: 'Contribution not found' }, { status: 404 })
        }

        // Check if transition is valid
        const currentTransitions = STATUS_TRANSITIONS[contribution.status]
        if (!currentTransitions || !currentTransitions.allowed.includes(newStatus)) {
            return NextResponse.json(
                {
                    error: `Invalid transition: ${contribution.status} → ${newStatus}. ` +
                        `Allowed: ${currentTransitions?.allowed.join(', ') || 'none (terminal state)'}`,
                },
                { status: 400 }
            )
        }

        // Permission check: verifier transitions require VERIFIER role,
        // author transitions require being the author
        if (VERIFIER_TRANSITIONS.includes(newStatus)) {
            if (!hasRole(user.role, 'VERIFIER')) {
                return NextResponse.json(
                    { error: 'Forbidden: VERIFIER role required to approve/reject' },
                    { status: 403 }
                )
            }
        } else if (AUTHOR_TRANSITIONS.includes(newStatus)) {
            if (contribution.authorId !== session.user.id && !hasRole(user.role, 'ADMIN')) {
                return NextResponse.json(
                    { error: 'Forbidden: Only the author can submit or withdraw' },
                    { status: 403 }
                )
            }
        }

        // Build update data
        const updateData: Prisma.ContributionUpdateInput = {
            status: newStatus,
        }

        if (newStatus === 'PENDING' && contribution.status === 'DRAFT') {
            updateData.submittedAt = new Date()
        }

        if (VERIFIER_TRANSITIONS.includes(newStatus)) {
            updateData.reviewer = { connect: { id: session.user.id } }
            updateData.reviewedAt = new Date()
            if (reviewNote) {
                updateData.reviewNote = reviewNote
            }
        }

        if (newStatus === 'REJECTED') {
            updateData.rejectionCount = { increment: 1 }
        }

        if (newStatus === 'PENDING' && contribution.status === 'REJECTED') {
            // Resubmission — clear reviewer for fresh review
            updateData.reviewer = { disconnect: true }
            updateData.reviewedAt = null
            updateData.reviewNote = null
        }

        const updatedContribution = await prisma.contribution.update({
            where: { id },
            data: updateData,
        })

        // On APPROVED: apply the contribution
        if (newStatus === 'APPROVED') {
            await applyContribution(contribution)
        }

        // Audit log
        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: 'UPDATE',
                entityType: 'Contribution',
                entityId: id,
                before: contribution as unknown as Prisma.JsonObject,
                after: updatedContribution as unknown as Prisma.JsonObject,
            },
        })

        return NextResponse.json(updatedContribution)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 })
        }
        console.error('Error updating contribution:', error)
        return NextResponse.json(
            { error: 'Failed to update contribution' },
            { status: 500 }
        )
    }
}

/**
 * Apply an approved contribution to the lineage tree.
 */
async function applyContribution(contribution: {
    type: string
    nodeId: string
    payload: unknown
    authorId: string
}) {
    const payload = contribution.payload as Record<string, unknown>

    switch (contribution.type) {
        case 'ADD_NODE': {
            // The nodeId is the parent in this context
            const parent = await prisma.lineageNode.findUnique({
                where: { id: contribution.nodeId },
                select: { generationDepth: true },
            })

            if (!parent) break

            await prisma.lineageNode.create({
                data: {
                    name: payload.name as string,
                    nameAr: payload.nameAr as string,
                    title: payload.title as string | undefined,
                    epithet: payload.epithet as string | undefined,
                    type: (payload.nodeType as 'ROOT' | 'TRIBE' | 'CLAN' | 'FAMILY' | 'INDIVIDUAL') || 'INDIVIDUAL',
                    parentId: contribution.nodeId,
                    generationDepth: parent.generationDepth + 1,
                    birthYear: payload.birthYear as number | undefined,
                    deathYear: payload.deathYear as number | undefined,
                    biography: payload.biography as string | undefined,
                    status: 'PUBLISHED',
                    createdById: contribution.authorId,
                },
            })

            // Increment parent's childCount
            await prisma.lineageNode.update({
                where: { id: contribution.nodeId },
                data: { childCount: { increment: 1 } },
            })
            break
        }

        case 'EDIT_NODE': {
            const updateFields: Record<string, unknown> = {}
            const editableFields = ['name', 'nameAr', 'title', 'epithet', 'biography', 'birthYear', 'deathYear']

            for (const field of editableFields) {
                if (field in payload) {
                    updateFields[field] = payload[field]
                }
            }

            if (Object.keys(updateFields).length > 0) {
                await prisma.lineageNode.update({
                    where: { id: contribution.nodeId },
                    data: updateFields,
                })
            }
            break
        }

        // ADD_SOURCE, ADD_EVENT, MERGE_NODES — future implementation
        default:
            console.log(`Contribution type ${contribution.type} auto-apply not yet implemented`)
    }
}
