import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { auth } from '@/lib/auth'
import { hasRole } from '@/lib/rbac'
import { createLineageNodeSchema, NODE_TYPE_ORDER } from '@/lib/validations/lineage'
import { z } from 'zod'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const rootOnly = searchParams.get('root') === 'true'
    const parentId = searchParams.get('parentId')
    const limit = parseInt(searchParams.get('limit') || '100')
    const skip = parseInt(searchParams.get('skip') || '0')

    try {
        const where: Prisma.LineageNodeWhereInput = {}

        if (rootOnly) {
            where.type = 'ROOT'
        } else if (parentId) {
            where.parentId = parentId
        }

        const [nodes, total] = await Promise.all([
            prisma.lineageNode.findMany({
                where,
                take: limit,
                skip,
                orderBy: {
                    birthYear: 'asc', // Visualizing by age often makes sense in trees
                },
            }),
            prisma.lineageNode.count({ where }),
        ])

        return NextResponse.json({
            data: nodes,
            meta: {
                total,
                page: Math.floor(skip / limit) + 1,
                limit,
            },
        })
    } catch (error) {
        console.error('Error fetching lineage nodes:', error)
        return NextResponse.json(
            { error: 'Failed to fetch lineage nodes' },
            { status: 500 }
        )
    }
}

/**
 * POST /api/lineage
 * Create a new lineage node.
 * - Validates input with Zod
 * - Enforces type hierarchy (TRIBE can't be child of CLAN, etc.)
 * - Auto-computes generationDepth from parent
 * - Increments parent's childCount
 * - Requires CONTRIBUTOR role
 */
export async function POST(request: NextRequest) {
    try {
        // Auth check
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Role check
        const user = await prisma.user.findUnique({ where: { id: session.user.id } })
        if (!user || !hasRole(user.role, 'CONTRIBUTOR')) {
            return NextResponse.json({ error: 'Forbidden: CONTRIBUTOR role required' }, { status: 403 })
        }

        const body = await request.json()
        const validated = createLineageNodeSchema.parse(body)

        // ROOT nodes must not have a parent
        if (validated.type === 'ROOT' && validated.parentId) {
            return NextResponse.json(
                { error: 'ROOT nodes cannot have a parent' },
                { status: 400 }
            )
        }

        // Non-ROOT nodes must have a parent
        if (validated.type !== 'ROOT' && !validated.parentId) {
            return NextResponse.json(
                { error: 'Non-ROOT nodes must have a parentId' },
                { status: 400 }
            )
        }

        let generationDepth = 0
        let parentType: string | null = null

        // Fetch parent and compute depth
        if (validated.parentId) {
            const parent = await prisma.lineageNode.findUnique({
                where: { id: validated.parentId },
                select: { generationDepth: true, type: true },
            })

            if (!parent) {
                return NextResponse.json(
                    { error: 'Parent node not found' },
                    { status: 404 }
                )
            }

            generationDepth = parent.generationDepth + 1
            parentType = parent.type
        }

        // Enforce type hierarchy: child type must be equal to or deeper than parent type
        if (parentType) {
            const parentTypeIndex = NODE_TYPE_ORDER.indexOf(parentType as typeof NODE_TYPE_ORDER[number])
            const childTypeIndex = NODE_TYPE_ORDER.indexOf(validated.type)

            if (childTypeIndex < parentTypeIndex) {
                return NextResponse.json(
                    {
                        error: `Type hierarchy violation: ${validated.type} cannot be a child of ${parentType}. ` +
                            `Expected one of: ${NODE_TYPE_ORDER.slice(parentTypeIndex).join(', ')}`,
                    },
                    { status: 400 }
                )
            }
        }

        // Create the node
        const { parentId, ...nodeData } = validated
        const newNode = await prisma.lineageNode.create({
            data: {
                ...nodeData,
                parentId: parentId || undefined,
                generationDepth,
                status: 'DRAFT',
                createdById: session.user.id,
            },
        })

        // Increment parent's childCount
        if (parentId) {
            await prisma.lineageNode.update({
                where: { id: parentId },
                data: { childCount: { increment: 1 } },
            })
        }

        // Audit log
        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: 'CREATE',
                entityType: 'LineageNode',
                entityId: newNode.id,
                after: newNode as unknown as Prisma.JsonObject,
            },
        })

        return NextResponse.json(newNode, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 })
        }
        console.error('Error creating lineage node:', error)
        return NextResponse.json(
            { error: 'Failed to create lineage node' },
            { status: 500 }
        )
    }
}
