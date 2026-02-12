import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const skip = parseInt(searchParams.get('skip') || '0')

    // Filters
    const typeFilter = searchParams.get('type') // ROOT, TRIBE, CLAN, FAMILY, INDIVIDUAL
    const eraFilter = searchParams.get('era')
    const statusFilter = searchParams.get('status') // PUBLISHED, DRAFT, etc.
    const regionFilter = searchParams.get('region') // birthPlace search
    const facets = searchParams.get('facets') === 'true'

    if (!query || query.length < 2) {
        return NextResponse.json({ data: [], meta: { total: 0 }, facets: {} })
    }

    try {
        // Build base text search condition
        const textSearch: Prisma.LineageNodeWhereInput = {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { nameAr: { contains: query, mode: 'insensitive' } },
                { alternateNames: { hasSome: [query] } },
                { title: { contains: query, mode: 'insensitive' } },
                { epithet: { contains: query, mode: 'insensitive' } },
            ],
        }

        // Build filter conditions
        const filters: Prisma.LineageNodeWhereInput[] = []

        if (typeFilter) {
            filters.push({ type: typeFilter as Prisma.LineageNodeWhereInput['type'] })
        }
        if (eraFilter) {
            filters.push({ era: { contains: eraFilter, mode: 'insensitive' } })
        }
        if (statusFilter) {
            filters.push({ status: statusFilter as Prisma.LineageNodeWhereInput['status'] })
        }
        if (regionFilter) {
            filters.push({ birthPlace: { contains: regionFilter, mode: 'insensitive' } })
        }

        // Combine text search + filters
        const where: Prisma.LineageNodeWhereInput = {
            AND: [textSearch, ...filters],
        }

        // Execute queries in parallel
        const queries: Promise<unknown>[] = [
            prisma.lineageNode.findMany({
                where,
                take: limit,
                skip,
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
                    birthPlace: true,
                    era: true,
                    childCount: true,
                    generationDepth: true,
                    parentId: true,
                },
                orderBy: [
                    { type: 'asc' },      // ROOT first, then TRIBE, etc.
                    { birthYear: 'asc' },
                ],
            }),
            prisma.lineageNode.count({ where }),
        ]

        // Compute facets if requested
        if (facets) {
            queries.push(
                // Type facets
                prisma.lineageNode.groupBy({
                    by: ['type'],
                    where: textSearch,
                    _count: true,
                }),
                // Era facets — get distinct eras with counts
                prisma.lineageNode.groupBy({
                    by: ['era'],
                    where: { ...textSearch, era: { not: null } },
                    _count: true,
                }),
                // Status facets
                prisma.lineageNode.groupBy({
                    by: ['status'],
                    where: textSearch,
                    _count: true,
                }),
            )
        }

        const results = await Promise.all(queries)

        const nodes = results[0]
        const total = results[1] as number

        const facetData: Record<string, Array<{ value: string; count: number }>> = {}
        if (facets && results.length > 2) {
            const typeFacets = results[2] as Array<{ type: string; _count: number }>
            const eraFacets = results[3] as Array<{ era: string | null; _count: number }>
            const statusFacets = results[4] as Array<{ status: string; _count: number }>

            facetData.type = typeFacets.map((f) => ({ value: f.type, count: f._count }))
            facetData.era = eraFacets
                .filter((f) => f.era)
                .map((f) => ({ value: f.era!, count: f._count }))
            facetData.status = statusFacets.map((f) => ({ value: f.status, count: f._count }))
        }

        return NextResponse.json({
            data: nodes,
            meta: {
                total,
                page: Math.floor(skip / limit) + 1,
                limit,
            },
            ...(facets && { facets: facetData }),
        })
    } catch (error) {
        console.error('Search error:', error)
        return NextResponse.json(
            { error: 'Failed to search nodes' },
            { status: 500 }
        )
    }
}

