import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { auth } from '@/lib/auth'
import { hasRole } from '@/lib/rbac'
import { z } from 'zod'

const updateUserSchema = z.object({
    role: z.enum(['VIEWER', 'CONTRIBUTOR', 'VERIFIER', 'ADMIN']).optional(),
})

/**
 * PUT /api/admin/users/:id
 * Update a user's role (ADMIN only).
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

        const currentUser = await prisma.user.findUnique({ where: { id: session.user.id } })
        if (!currentUser || !hasRole(currentUser.role, 'ADMIN')) {
            return NextResponse.json({ error: 'Forbidden: ADMIN role required' }, { status: 403 })
        }

        const body = await request.json()
        const validated = updateUserSchema.parse(body)

        // Prevent admin from demoting themselves
        if (id === session.user.id && validated.role && validated.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Cannot change your own admin role' },
                { status: 400 }
            )
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: validated,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        })

        // Audit log
        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: 'UPDATE',
                entityType: 'User',
                entityId: id,
                after: updatedUser as unknown as Prisma.JsonObject,
            },
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 })
        }
        console.error('Admin user update error:', error)
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }
}
