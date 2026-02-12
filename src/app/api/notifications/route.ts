import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

/**
 * GET /api/notifications
 * Fetch current user's notifications (unread first, then by date).
 * Query params: limit, skip, unreadOnly
 */
export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const searchParams = request.nextUrl.searchParams
        const limit = parseInt(searchParams.get('limit') || '20')
        const skip = parseInt(searchParams.get('skip') || '0')
        const unreadOnly = searchParams.get('unreadOnly') === 'true'

        const where = {
            userId: session.user.id,
            ...(unreadOnly ? { read: false } : {}),
        }

        const [notifications, total, unreadCount] = await Promise.all([
            prisma.notification.findMany({
                where,
                take: limit,
                skip,
                orderBy: [
                    { read: 'asc' },       // Unread first
                    { createdAt: 'desc' },  // Then newest
                ],
            }),
            prisma.notification.count({ where }),
            prisma.notification.count({
                where: { userId: session.user.id, read: false },
            }),
        ])

        return NextResponse.json({
            data: notifications,
            meta: { total, unreadCount, page: Math.floor(skip / limit) + 1, limit },
        })
    } catch (error) {
        console.error('Notifications GET error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch notifications' },
            { status: 500 }
        )
    }
}

/**
 * POST /api/notifications
 * Mark notification(s) as read.
 * Body: { ids: string[] } or { markAllRead: true }
 */
export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()

        if (body.markAllRead) {
            const result = await prisma.notification.updateMany({
                where: { userId: session.user.id, read: false },
                data: { read: true },
            })
            return NextResponse.json({ updated: result.count })
        }

        if (body.ids && Array.isArray(body.ids)) {
            const result = await prisma.notification.updateMany({
                where: {
                    id: { in: body.ids },
                    userId: session.user.id, // Ensure ownership
                },
                data: { read: true },
            })
            return NextResponse.json({ updated: result.count })
        }

        return NextResponse.json(
            { error: 'Provide { ids: [...] } or { markAllRead: true }' },
            { status: 400 }
        )
    } catch (error) {
        console.error('Notifications POST error:', error)
        return NextResponse.json(
            { error: 'Failed to update notifications' },
            { status: 500 }
        )
    }
}
