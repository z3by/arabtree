import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock Prisma
const mockFindUnique = vi.fn()
const mockCount = vi.fn()
const mockFindMany = vi.fn()

vi.mock('@/lib/prisma', () => ({
    default: {
        user: {
            findUnique: (...args: unknown[]) => mockFindUnique(...args),
        },
        contribution: {
            count: (...args: unknown[]) => mockCount(...args),
            findMany: (...args: unknown[]) => mockFindMany(...args),
        },
    },
}))

// Mock auth
const mockAuth = vi.fn()
vi.mock('@/lib/auth', () => ({
    auth: () => mockAuth(),
}))

// Dynamic import to get the module after mocks are set up
async function getRoute() {
    return import('../route')
}

function createRequest() {
    return new NextRequest('http://localhost:3000/api/users/user-123/profile')
}

describe('GET /api/users/[id]/profile', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns 401 when NOT authenticated (fix verified)', async () => {
        // Mock session to be null (unauthenticated)
        mockAuth.mockResolvedValue(null)

        const { GET } = await getRoute()
        const response = await GET(createRequest(), { params: Promise.resolve({ id: 'user-123' }) })

        expect(response.status).toBe(401)
        const body = await response.json()
        expect(body.error).toBe('Unauthorized')
    })

    it('returns 200 when authenticated', async () => {
        // Mock session to be valid
        mockAuth.mockResolvedValue({ user: { id: 'auth-user-id' } })

        // Mock data
        mockFindUnique.mockResolvedValue({
            id: 'user-123',
            name: 'Test User',
            role: 'VIEWER',
        })
        mockCount.mockResolvedValue(0)
        mockFindMany.mockResolvedValue([])

        const { GET } = await getRoute()
        const response = await GET(createRequest(), { params: Promise.resolve({ id: 'user-123' }) })

        expect(response.status).toBe(200)
        const body = await response.json()
        expect(body.user.name).toBe('Test User')
    })
})
