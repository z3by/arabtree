import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                image: true,
                role: true,
                bio: true,
                reputationScore: true,
                createdAt: true,
                // Do NOT expose email or passwordHash
            },
        })

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        // Contribution stats
        const [total, approved, pending, rejected] = await Promise.all([
            prisma.contribution.count({ where: { authorId: id } }),
            prisma.contribution.count({ where: { authorId: id, status: 'APPROVED' } }),
            prisma.contribution.count({ where: { authorId: id, status: 'PENDING' } }),
            prisma.contribution.count({ where: { authorId: id, status: 'REJECTED' } }),
        ])

        // Verified tribes — distinct nodes where user has approved contributions
        const approvedContributions = await prisma.contribution.findMany({
            where: { authorId: id, status: 'APPROVED' },
            select: {
                node: {
                    select: {
                        id: true,
                        name: true,
                        nameAr: true,
                        type: true,
                    },
                },
            },
            distinct: ['nodeId'],
        })
        const verifiedTribes = approvedContributions.map((c) => c.node)

        // Recent contributions (last 10)
        const recentContributions = await prisma.contribution.findMany({
            where: { authorId: id },
            orderBy: { createdAt: 'desc' },
            take: 10,
            select: {
                id: true,
                type: true,
                status: true,
                summary: true,
                createdAt: true,
                submittedAt: true,
                reviewedAt: true,
                node: {
                    select: {
                        id: true,
                        name: true,
                        nameAr: true,
                        type: true,
                    },
                },
            },
        })

        return NextResponse.json({
            user,
            stats: { total, approved, pending, rejected },
            verifiedTribes,
            recentContributions,
        })
    } catch (error) {
        console.error('Failed to fetch user profile:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
