import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { hasRole } from '@/lib/rbac'
import { Prisma } from '@prisma/client'

/**
 * GET /api/admin/users
 * List all users with pagination (ADMIN only).
 */
export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({ where: { id: session.user.id } })
        if (!user || !hasRole(user.role, 'ADMIN')) {
            return NextResponse.json({ error: 'Forbidden: ADMIN role required' }, { status: 403 })
        }

        const searchParams = request.nextUrl.searchParams
        const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
        const skip = parseInt(searchParams.get('skip') || '0')
        const search = searchParams.get('search')
        const role = searchParams.get('role')

        const where: Prisma.UserWhereInput = {}
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ]
        }
        if (role) {
            where.role = role as Prisma.UserWhereInput['role']
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                take: limit,
                skip,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    role: true,
                    createdAt: true,
                    _count: {
                        select: {
                            contributions: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.user.count({ where }),
        ])

        return NextResponse.json({ data: users, meta: { total, limit } })
    } catch (error) {
        console.error('Admin users error:', error)
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }
}
