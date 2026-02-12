import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            where: {
                reputationScore: { gt: 0 },
            },
            orderBy: { reputationScore: 'desc' },
            take: 20,
            select: {
                id: true,
                name: true,
                image: true,
                role: true,
                reputationScore: true,
                createdAt: true,
                _count: {
                    select: {
                        contributions: {
                            where: { status: 'APPROVED' },
                        },
                    },
                },
            },
        })

        const leaderboard = users.map((user, index) => ({
            rank: index + 1,
            id: user.id,
            name: user.name,
            image: user.image,
            role: user.role,
            reputationScore: user.reputationScore,
            approvedContributions: user._count.contributions,
            createdAt: user.createdAt,
        }))

        return NextResponse.json({ leaderboard })
    } catch (error) {
        console.error('Failed to fetch leaderboard:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
