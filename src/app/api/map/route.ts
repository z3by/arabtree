import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const typeFilter = searchParams.get('type')
    const eraFilter = searchParams.get('era')
    const yearFrom = searchParams.get('yearFrom')
    const yearTo = searchParams.get('yearTo')
    const eventType = searchParams.get('eventType')

    try {
        // ── Fetch nodes with geolocation ──
        const nodeWhere: Prisma.LineageNodeWhereInput = {
            AND: [
                { latitude: { not: null } },
                { longitude: { not: null } },
                { status: 'PUBLISHED' },
            ],
        }

        if (typeFilter) {
            (nodeWhere.AND as Prisma.LineageNodeWhereInput[]).push({
                type: typeFilter as Prisma.LineageNodeWhereInput['type'],
            })
        }
        if (eraFilter) {
            (nodeWhere.AND as Prisma.LineageNodeWhereInput[]).push({
                era: { contains: eraFilter, mode: 'insensitive' },
            })
        }

        const nodes = await prisma.lineageNode.findMany({
            where: nodeWhere,
            select: {
                id: true,
                name: true,
                nameAr: true,
                type: true,
                era: true,
                birthYear: true,
                deathYear: true,
                birthPlace: true,
                latitude: true,
                longitude: true,
                title: true,
                childCount: true,
            },
            orderBy: { type: 'asc' },
        })

        // ── Fetch historical events with geolocation ──
        const eventWhere: Prisma.HistoricalEventWhereInput = {
            AND: [
                { latitude: { not: null } },
                { longitude: { not: null } },
            ],
        }

        if (yearFrom) {
            (eventWhere.AND as Prisma.HistoricalEventWhereInput[]).push({
                yearCE: { gte: parseInt(yearFrom) },
            })
        }
        if (yearTo) {
            (eventWhere.AND as Prisma.HistoricalEventWhereInput[]).push({
                yearCE: { lte: parseInt(yearTo) },
            })
        }
        if (eventType) {
            (eventWhere.AND as Prisma.HistoricalEventWhereInput[]).push({
                eventType: eventType as Prisma.HistoricalEventWhereInput['eventType'],
            })
        }

        const events = await prisma.historicalEvent.findMany({
            where: eventWhere,
            select: {
                id: true,
                title: true,
                titleAr: true,
                description: true,
                descriptionAr: true,
                yearCE: true,
                yearHijri: true,
                eventType: true,
                location: true,
                latitude: true,
                longitude: true,
                node: {
                    select: {
                        id: true,
                        name: true,
                        nameAr: true,
                        type: true,
                    },
                },
            },
            orderBy: { yearCE: 'asc' },
        })

        return NextResponse.json({ nodes, events })
    } catch (error) {
        console.error('Map API error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch map data' },
            { status: 500 }
        )
    }
}
