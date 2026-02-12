import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { auth } from '@/lib/auth'
import { hasRole } from '@/lib/rbac'
import { updateLineageNodeSchema } from '@/lib/validations/lineage'
import { z } from 'zod'

/**
 * GET /api/lineage/:id
 * Fetch a single lineage node by ID, including:
 * - The node's full data
 * - Its direct children (first 50, ordered by birthYear)
 * - Its ancestor path from root to current node
 * - Optionally, a subtree of N levels deep
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const searchParams = request.nextUrl.searchParams
    const subtreeDepth = parseInt(searchParams.get('subtreeDepth') || '0')

    try {
        // Fetch the node with its direct children
        const node = await prisma.lineageNode.findUnique({
            where: { id },
            include: {
                children: {
                    take: 50,
                    orderBy: { birthYear: 'asc' },
                    select: {
                        id: true,
                        name: true,
                        nameAr: true,
                        title: true,
                        epithet: true,
                        type: true,
                        status: true,
                        birthYear: true,
                        deathYear: true,
                        childCount: true,
                        era: true,
                    },
                },
            },
        })

        if (!node) {
            return NextResponse.json(
                { error: 'Node not found' },
                { status: 404 }
            )
        }

        // Build ancestor path by walking up the parent chain
        const ancestors = await getAncestorPath(node.parentId)

        // Optionally fetch a subtree
        let subtree = null
        if (subtreeDepth > 0) {
            subtree = await getSubtree(id, subtreeDepth)
        }

        return NextResponse.json({
            node,
            ancestors,
            children: node.children,
            ...(subtree && { subtree }),
        })
    } catch (error) {
        console.error('Error fetching lineage node:', error)
        return NextResponse.json(
            { error: 'Failed to fetch lineage node' },
            { status: 500 }
        )
    }
}

/**
 * PUT /api/lineage/:id
 * Update metadata on an existing lineage node.
 * - Validates input with Zod
 * - Creates audit log with before/after snapshots
 * - Requires CONTRIBUTOR role
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

    try {
        // Auth check
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({ where: { id: session.user.id } })
        if (!user || !hasRole(user.role, 'CONTRIBUTOR')) {
            return NextResponse.json({ error: 'Forbidden: CONTRIBUTOR role required' }, { status: 403 })
        }

        // Fetch existing node for before snapshot
        const existingNode = await prisma.lineageNode.findUnique({ where: { id } })
        if (!existingNode) {
            return NextResponse.json({ error: 'Node not found' }, { status: 404 })
        }

        const body = await request.json()
        const validated = updateLineageNodeSchema.parse(body)

        // Update the node
        const updatedNode = await prisma.lineageNode.update({
            where: { id },
            data: validated,
        })

        // Audit log
        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: 'UPDATE',
                entityType: 'LineageNode',
                entityId: id,
                before: existingNode as unknown as Prisma.JsonObject,
                after: updatedNode as unknown as Prisma.JsonObject,
            },
        })

        return NextResponse.json(updatedNode)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 })
        }
        console.error('Error updating lineage node:', error)
        return NextResponse.json(
            { error: 'Failed to update lineage node' },
            { status: 500 }
        )
    }
}

/**
 * DELETE /api/lineage/:id
 * Soft-delete (archive) a lineage node.
 * - Sets status to ARCHIVED
 * - Decrements parent's childCount
 * - Creates audit log
 * - Requires CONTRIBUTOR role (owner) or ADMIN
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

    try {
        // Auth check
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({ where: { id: session.user.id } })
        if (!user || !hasRole(user.role, 'CONTRIBUTOR')) {
            return NextResponse.json({ error: 'Forbidden: CONTRIBUTOR role required' }, { status: 403 })
        }

        // Fetch existing node
        const existingNode = await prisma.lineageNode.findUnique({ where: { id } })
        if (!existingNode) {
            return NextResponse.json({ error: 'Node not found' }, { status: 404 })
        }

        // Only the creator or an ADMIN can archive
        if (existingNode.createdById !== session.user.id && !hasRole(user.role, 'ADMIN')) {
            return NextResponse.json(
                { error: 'Forbidden: Only the creator or an ADMIN can archive this node' },
                { status: 403 }
            )
        }

        // Prevent archiving nodes that still have active children
        const activeChildCount = await prisma.lineageNode.count({
            where: { parentId: id, status: { not: 'ARCHIVED' } },
        })
        if (activeChildCount > 0) {
            return NextResponse.json(
                { error: `Cannot archive: this node has ${activeChildCount} active child node(s). Archive children first.` },
                { status: 400 }
            )
        }

        // Soft-delete: set status to ARCHIVED
        const archivedNode = await prisma.lineageNode.update({
            where: { id },
            data: { status: 'ARCHIVED' },
        })

        // Decrement parent's childCount
        if (existingNode.parentId) {
            await prisma.lineageNode.update({
                where: { id: existingNode.parentId },
                data: { childCount: { decrement: 1 } },
            })
        }

        // Audit log
        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: 'DELETE',
                entityType: 'LineageNode',
                entityId: id,
                before: existingNode as unknown as Prisma.JsonObject,
                after: archivedNode as unknown as Prisma.JsonObject,
            },
        })

        return NextResponse.json({ message: 'Node archived successfully' })
    } catch (error) {
        console.error('Error archiving lineage node:', error)
        return NextResponse.json(
            { error: 'Failed to archive lineage node' },
            { status: 500 }
        )
    }
}

// ── Helper Functions ──

/**
 * Recursively walk up the parent chain to build the ancestor path.
 * Returns an array ordered from root → ... → parent (closest ancestor last).
 */
async function getAncestorPath(
    parentId: string | null
): Promise<
    Array<{
        id: string
        name: string
        nameAr: string
        type: string
    }>
> {
    const ancestors: Array<{
        id: string
        name: string
        nameAr: string
        type: string
    }> = []

    let currentParentId = parentId

    // Walk up the tree (max 100 levels to prevent infinite loops)
    let safety = 0
    while (currentParentId && safety < 100) {
        safety++
        const parent = await prisma.lineageNode.findUnique({
            where: { id: currentParentId },
            select: {
                id: true,
                name: true,
                nameAr: true,
                type: true,
                parentId: true,
            },
        })

        if (!parent) break

        ancestors.unshift({
            id: parent.id,
            name: parent.name,
            nameAr: parent.nameAr,
            type: parent.type,
        })

        currentParentId = parent.parentId
    }

    return ancestors
}

/**
 * Fetch a subtree of N levels deep from a given node.
 * Returns a nested structure for tree visualization.
 */
interface SubtreeNode {
    id: string
    name: string
    nameAr: string
    type: string
    childCount: number
    children: SubtreeNode[]
}

async function getSubtree(nodeId: string, maxDepth: number, currentDepth: number = 0): Promise<SubtreeNode | null> {
    if (currentDepth > maxDepth) return null

    const node = await prisma.lineageNode.findUnique({
        where: { id: nodeId },
        select: {
            id: true,
            name: true,
            nameAr: true,
            type: true,
            childCount: true,
            children: {
                where: { status: { not: 'ARCHIVED' } },
                take: 100,
                orderBy: { birthYear: 'asc' },
                select: { id: true },
            },
        },
    })

    if (!node) return null

    const children: SubtreeNode[] = []
    if (currentDepth < maxDepth) {
        for (const child of node.children) {
            const childSubtree = await getSubtree(child.id, maxDepth, currentDepth + 1)
            if (childSubtree) children.push(childSubtree)
        }
    }

    return {
        id: node.id,
        name: node.name,
        nameAr: node.nameAr,
        type: node.type,
        childCount: node.childCount,
        children,
    }
}

