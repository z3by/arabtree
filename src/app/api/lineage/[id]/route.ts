import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * GET /api/lineage/:id
 * Fetch a single lineage node by ID, including:
 * - The node's full data
 * - Its direct children (first 50, ordered by birthYear)
 * - Its ancestor path from root to current node
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

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

        return NextResponse.json({
            node,
            ancestors,
            children: node.children,
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
