import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { contributionSchema } from '@/lib/validations/contribution'
import { auth } from '@/lib/auth'
import { z } from 'zod' // Assuming we have auth helper, or use session

export async function POST(request: NextRequest) {
    try {
        // TODO: Verify authentication (Phase 1 auth)
        // const session = await auth()
        // if (!session?.user) return new NextResponse("Unauthorized", { status: 401 })

        // For now, allow anonymous or mock user for dev if auth helper not ready
        // user ID is required by schema: authorId String @db.ObjectId
        // I need a valid user ID. 
        // I will fetch the first user from DB or create a dummy one if none exists in dev mode.
        // Ideally I should use session.user.id.

        const body = await request.json()
        const validatedData = contributionSchema.parse(body)

        // Mock author for now if auth not fully wired in this context
        // In production, MUST use session.user.id
        // Let's assume there is at least one user or fail gracefully.
        const firstUser = await prisma.user.findFirst()

        if (!firstUser) {
            return NextResponse.json({ error: 'No users found. Please seed database or sign up.' }, { status: 400 })
        }

        const { type, nodeId, parentId, summary, ...payload } = validatedData

        // If ADD_NODE, we need parentId. If EDIT_NODE, we need nodeId.
        if (type === 'ADD_NODE' && !parentId) {
            return NextResponse.json({ error: 'Parent ID is required for adding a node' }, { status: 400 })
        }
        if ((type === 'EDIT_NODE' || type === 'MERGE_NODES') && !nodeId) {
            return NextResponse.json({ error: 'Node ID is required for editing/merging' }, { status: 400 })
        }

        // Default nodeId to parentId if adding node? No, nodeId refers to the node being acted upon.
        // For ADD_NODE, nodeId is null until created. But Contribution relation says nodeId is required?
        // model Contribution { ... nodeId String @db.ObjectId ... node LineageNode ... }
        // This implies validation logic: a Contribution must be linked to an EXISTING node?
        // If I am ADDING a node, I don't have a nodeId yet.
        // Maybe I should link it to the PARENT node?
        // Let's check schema: `node LineageNode @relation(...)`.
        // If I add a node, I am contributing TO the parent node (adding a child).
        // So for ADD_NODE, `nodeId` should be the `parentId`.

        let targetNodeId = nodeId
        if (type === 'ADD_NODE') {
            targetNodeId = parentId!
        }

        if (!targetNodeId) {
            return NextResponse.json({ error: 'Target node ID (or Parent ID) is missing' }, { status: 400 })
        }

        const contribution = await prisma.contribution.create({
            data: {
                type: type as any, // Enum casting
                nodeId: targetNodeId,
                authorId: firstUser.id,
                payload: payload as any, // JSON
                summary,
                status: 'PENDING', // Auto-submit for review
                submittedAt: new Date(),
            },
        })

        return NextResponse.json(contribution)
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
