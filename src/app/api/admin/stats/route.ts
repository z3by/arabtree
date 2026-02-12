import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { hasRole } from '@/lib/rbac'

/**
 * GET /api/admin/stats
 * Dashboard analytics for ADMIN users.
 */
export async function GET() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({ where: { id: session.user.id } })
        if (!user || !hasRole(user.role, 'ADMIN')) {
            return NextResponse.json({ error: 'Forbidden: ADMIN role required' }, { status: 403 })
        }

        const [
            totalUsers,
            totalNodes,
            totalContributions,
            pendingContributions,
            recentAuditLogs,
            nodesByType,
            contributionsByStatus,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.lineageNode.count({ where: { status: { not: 'ARCHIVED' } } }),
            prisma.contribution.count(),
            prisma.contribution.count({ where: { status: 'PENDING' } }),
            prisma.auditLog.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { name: true } },
                },
            }),
            prisma.lineageNode.groupBy({
                by: ['type'],
                _count: true,
                where: { status: { not: 'ARCHIVED' } },
            }),
            prisma.contribution.groupBy({
                by: ['status'],
                _count: true,
            }),
        ])

        return NextResponse.json({
            users: totalUsers,
            nodes: totalNodes,
            contributions: totalContributions,
            pendingContributions,
            nodesByType: nodesByType.map((g) => ({ type: g.type, count: g._count })),
            contributionsByStatus: contributionsByStatus.map((g) => ({ status: g.status, count: g._count })),
            recentActivity: recentAuditLogs.map((log) => ({
                id: log.id,
                action: log.action,
                entityType: log.entityType,
                entityId: log.entityId,
                user: log.user.name,
                createdAt: log.createdAt,
            })),
        })
    } catch (error) {
        console.error('Admin stats error:', error)
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
    }
}
