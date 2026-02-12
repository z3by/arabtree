import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { contributionSchema } from '@/lib/validations/contribution'
import { auth } from '@/lib/auth'
import { hasRole } from '@/lib/rbac'
import { z } from 'zod'

/**
 * GET /api/contributions
 * List contributions with optional filters.
 * - VERIFIER+ can see all contributions
 * - Regular users see only their own
 */
export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({ where: { id: session.user.id } })
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const searchParams = request.nextUrl.searchParams
        const status = searchParams.get('status')
        const nodeId = searchParams.get('nodeId')
        const authorId = searchParams.get('authorId')
        const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
        const skip = parseInt(searchParams.get('skip') || '0')

        const where: Prisma.ContributionWhereInput = {}

        // Non-verifiers can only see their own contributions
        if (!hasRole(user.role, 'VERIFIER')) {
            where.authorId = session.user.id
        } else if (authorId) {
            where.authorId = authorId
        }

        if (status) {
            where.status = status as Prisma.ContributionWhereInput['status']
        }
        if (nodeId) {
            where.nodeId = nodeId
        }

        const [contributions, total] = await Promise.all([
            prisma.contribution.findMany({
                where,
                take: limit,
                skip,
                orderBy: { createdAt: 'desc' },
                include: {
                    author: {
                        select: { id: true, name: true, image: true },
                    },
                    node: {
                        select: { id: true, name: true, nameAr: true, type: true },
                    },
                    reviewer: {
                        select: { id: true, name: true },
                    },
                },
            }),
            prisma.contribution.count({ where }),
        ])

        return NextResponse.json({
            data: contributions,
            meta: { total, page: Math.floor(skip / limit) + 1, limit },
        })
    } catch (error) {
        console.error('Error fetching contributions:', error)
        return NextResponse.json(
            { error: 'Failed to fetch contributions' },
            { status: 500 }
        )
    }
}

/**
 * POST /api/contributions
 * Submit a new contribution for review.
 */
export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const validatedData = contributionSchema.parse(body)

        const { type, nodeId, parentId, summary, ...payload } = validatedData

        // Validate type-specific required fields
        if (type === 'ADD_NODE' && !parentId) {
            return NextResponse.json({ error: 'Parent ID is required for adding a node' }, { status: 400 })
        }
        if ((type === 'EDIT_NODE' || type === 'MERGE_NODES') && !nodeId) {
            return NextResponse.json({ error: 'Node ID is required for editing/merging' }, { status: 400 })
        }

        // For ADD_NODE, link to parent node; otherwise link to the target node
        let targetNodeId = nodeId
        if (type === 'ADD_NODE') {
            targetNodeId = parentId!
        }

        if (!targetNodeId) {
            return NextResponse.json({ error: 'Target node ID is missing' }, { status: 400 })
        }

        // Verify target node exists
        const targetNode = await prisma.lineageNode.findUnique({ where: { id: targetNodeId } })
        if (!targetNode) {
            return NextResponse.json({ error: 'Target node not found' }, { status: 404 })
        }

        const contribution = await prisma.contribution.create({
            data: {
                type: type as any,
                nodeId: targetNodeId,
                authorId: session.user.id,
                payload: payload as any,
                summary,
                status: 'PENDING',
                submittedAt: new Date(),
            },
        })

        // Audit log
        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: 'CREATE',
                entityType: 'Contribution',
                entityId: contribution.id,
                after: contribution as unknown as Prisma.JsonObject,
            },
        })

        return NextResponse.json(contribution, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 })
        }
        console.error('Contribution error:', error)
        return NextResponse.json(
            { error: 'Failed to submit contribution' },
            { status: 500 }
        )
    }
}

