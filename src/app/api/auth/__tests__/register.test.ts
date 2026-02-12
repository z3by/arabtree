import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock prisma
const mockFindUnique = vi.fn()
const mockCreate = vi.fn()
vi.mock('@/lib/prisma', () => ({
    default: {
        user: {
            findUnique: (...args: unknown[]) => mockFindUnique(...args),
            create: (...args: unknown[]) => mockCreate(...args),
        },
    },
}))

// Mock bcrypt
vi.mock('bcryptjs', () => ({
    default: {
        hash: vi.fn().mockResolvedValue('hashed_password_123'),
    },
}))

// Dynamic import to get the module after mocks are set up
async function getRoute() {
    return import('@/app/api/auth/register/route')
}

function createRequest(body: Record<string, unknown>) {
    return new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
}

describe('POST /api/auth/register', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns 400 for missing name', async () => {
        const { POST } = await getRoute()
        const request = createRequest({ email: 'test@example.com', password: '123456' })
        const response = await POST(request)
        expect(response.status).toBe(400)
    })

    it('returns 400 for invalid email', async () => {
        const { POST } = await getRoute()
        const request = createRequest({ name: 'Test', email: 'not-an-email', password: '123456' })
        const response = await POST(request)
        expect(response.status).toBe(400)
    })

    it('returns 400 for short password (< 6 chars)', async () => {
        const { POST } = await getRoute()
        const request = createRequest({ name: 'Test', email: 'test@example.com', password: '12345' })
        const response = await POST(request)
        expect(response.status).toBe(400)
    })

    it('returns 400 for missing email', async () => {
        const { POST } = await getRoute()
        const request = createRequest({ name: 'Test', password: '123456' })
        const response = await POST(request)
        expect(response.status).toBe(400)
    })

    it('returns 400 for missing password', async () => {
        const { POST } = await getRoute()
        const request = createRequest({ name: 'Test', email: 'test@example.com' })
        const response = await POST(request)
        expect(response.status).toBe(400)
    })

    it('returns 409 when email already exists', async () => {
        mockFindUnique.mockResolvedValue({ id: 'existing-id', email: 'test@example.com' })

        const { POST } = await getRoute()
        const request = createRequest({
            name: 'Test User',
            email: 'test@example.com',
            password: '123456',
        })
        const response = await POST(request)
        expect(response.status).toBe(409)

        const body = await response.json()
        expect(body.error).toBeTruthy()
    })

    it('returns 201 and creates user on valid input', async () => {
        mockFindUnique.mockResolvedValue(null) // No existing user
        mockCreate.mockResolvedValue({
            id: 'new-user-id',
            name: 'Test User',
            email: 'test@example.com',
            role: 'VIEWER',
            createdAt: new Date(),
        })

        const { POST } = await getRoute()
        const request = createRequest({
            name: 'Test User',
            email: 'test@example.com',
            password: 'securepassword',
        })
        const response = await POST(request)
        expect(response.status).toBe(201)

        const body = await response.json()
        expect(body.id).toBe('new-user-id')
        expect(body.name).toBe('Test User')
        expect(body.email).toBe('test@example.com')
        expect(body.role).toBe('VIEWER')
    })

    it('calls prisma.user.create with hashed password and VIEWER role', async () => {
        mockFindUnique.mockResolvedValue(null)
        mockCreate.mockResolvedValue({
            id: 'new-user-id',
            name: 'Test',
            email: 'test@example.com',
            role: 'VIEWER',
            createdAt: new Date(),
        })

        const { POST } = await getRoute()
        const request = createRequest({
            name: 'Test',
            email: 'test@example.com',
            password: 'securepassword',
        })
        await POST(request)

        expect(mockCreate).toHaveBeenCalledWith({
            data: expect.objectContaining({
                name: 'Test',
                email: 'test@example.com',
                passwordHash: 'hashed_password_123',
                role: 'VIEWER',
            }),
            select: expect.any(Object),
        })
    })

    it('returns 400 for name shorter than 2 characters', async () => {
        const { POST } = await getRoute()
        const request = createRequest({ name: 'A', email: 'test@example.com', password: '123456' })
        const response = await POST(request)
        expect(response.status).toBe(400)
    })
})
