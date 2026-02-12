import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

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
