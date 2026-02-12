import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!query || query.length < 2) {
        return NextResponse.json({ data: [] })
    }

    try {
        const nodes = await prisma.lineageNode.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { nameAr: { contains: query, mode: 'insensitive' } },
                    { alternateNames: { hasSome: [query] } }, // Exact match in array for now, usually regex needed for array contains
                    // Note: hasSome [query] only matches exact strings in the array. 
                    // MongoDB provider supports 'contains' for String fields but limited for arrays.
                    // For now, check name/nameAr mainly.
                ],
            },
            take: limit,
            orderBy: {
                birthYear: 'asc',
            },
        })

        return NextResponse.json({ data: nodes })
    } catch (error) {
        console.error('Search error:', error)
        return NextResponse.json(
            { error: 'Failed to search nodes' },
            { status: 500 }
        )
    }
}
