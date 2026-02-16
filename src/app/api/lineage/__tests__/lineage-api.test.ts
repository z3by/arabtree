import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock Prisma
const mockFindMany = vi.fn()
const mockCount = vi.fn()

vi.mock('@/lib/prisma', () => ({
    default: {
        lineageNode: {
            findMany: (...args: unknown[]) => mockFindMany(...args),
            count: (...args: unknown[]) => mockCount(...args),
        },
    },
}))

// Mock Sentry
const mockCaptureException = vi.fn()
vi.mock('@sentry/nextjs', () => ({
    captureException: mockCaptureException,
}))

// Mock auth + rbac (required by the module even though GET doesn't use them)
vi.mock('@/lib/auth', () => ({
    auth: vi.fn().mockResolvedValue(null),
}))
vi.mock('@/lib/rbac', () => ({
    hasRole: vi.fn().mockReturnValue(false),
}))

// Dynamic import to get the module after mocks are set up
async function getRoute() {
    return import('../route')
}

function createRequest(params: Record<string, string> = {}) {
    const url = new URL('http://localhost:3000/api/lineage')
    for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, value)
    }
    return new NextRequest(url)
}

describe('GET /api/lineage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns all nodes when all=true', async () => {
        const mockNodes = [
            { id: '1', name: 'Adnan', nameAr: 'عدنان', type: 'ROOT' },
            { id: '2', name: "Ma'add", nameAr: 'معد', type: 'TRIBE' },
        ]
        mockFindMany.mockResolvedValue(mockNodes)
        mockCount.mockResolvedValue(2)

        const { GET } = await getRoute()
        const response = await GET(createRequest({ all: 'true' }))
        const body = await response.json()

        expect(response.status).toBe(200)
        expect(body.data).toHaveLength(2)
        expect(body.meta.total).toBe(2)
        expect(body.meta.limit).toBe(2000)
    })

    it('returns root nodes when root=true', async () => {
        const mockNodes = [
            { id: '1', name: 'Adnan', nameAr: 'عدنان', type: 'ROOT' },
        ]
        mockFindMany.mockResolvedValue(mockNodes)
        mockCount.mockResolvedValue(1)

        const { GET } = await getRoute()
        const response = await GET(createRequest({ root: 'true' }))
        const body = await response.json()

        expect(response.status).toBe(200)
        expect(body.data).toHaveLength(1)
        expect(mockFindMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({ type: 'ROOT' }),
            })
        )
    })

    it('returns children when parentId is provided', async () => {
        mockFindMany.mockResolvedValue([])
        mockCount.mockResolvedValue(0)

        const { GET } = await getRoute()
        const response = await GET(createRequest({ parentId: 'abc123' }))

        expect(response.status).toBe(200)
        expect(mockFindMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({ parentId: 'abc123' }),
            })
        )
    })

    it('returns 500 with error type when Prisma throws', async () => {
        const prismaError = new Error('Connection refused')
        mockFindMany.mockRejectedValue(prismaError)

        const { GET } = await getRoute()
        const response = await GET(createRequest({ all: 'true' }))
        const body = await response.json()

        expect(response.status).toBe(500)
        expect(body.error).toBe('Failed to fetch lineage nodes')
        expect(body.type).toBe('Error')
    })

    it('includes error type in 500 response for debugging', async () => {
        const error = new Error('DB connection failed')
        mockFindMany.mockRejectedValue(error)

        const { GET } = await getRoute()
        const response = await GET(createRequest({ all: 'true' }))
        const body = await response.json()

        expect(response.status).toBe(500)
        expect(body.error).toBe('Failed to fetch lineage nodes')
        expect(body.type).toBe('Error')
    })

    it('respects limit and skip pagination', async () => {
        mockFindMany.mockResolvedValue([])
        mockCount.mockResolvedValue(50)

        const { GET } = await getRoute()
        const response = await GET(createRequest({ limit: '10', skip: '20' }))
        const body = await response.json()

        expect(response.status).toBe(200)
        expect(body.meta.page).toBe(3) // skip=20, limit=10 → page 3
        expect(body.meta.limit).toBe(10)
        expect(mockFindMany).toHaveBeenCalledWith(
            expect.objectContaining({
                take: 10,
                skip: 20,
            })
        )
    })
})
