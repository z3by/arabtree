/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest'
import { authConfig } from '@/lib/auth.config'

// Helper to invoke the authorized callback
function callAuthorized(auth: { user?: { role?: string } } | null, pathname: string) {
    const nextUrl = new URL(`http://localhost:3000${pathname}`)
    const request = { nextUrl } as any
    return (authConfig.callbacks as any).authorized({ auth, request })
}

describe('auth.config callbacks', () => {
    describe('authorized callback', () => {
        it('allows access to public routes for unauthenticated users', () => {
            const result = callAuthorized(null, '/')
            expect(result).toBe(true)
        })

        it('allows access to public routes for authenticated users', () => {
            const result = callAuthorized({ user: { role: 'VIEWER' } }, '/')
            expect(result).toBe(true)
        })

        it('allows access to /tree for unauthenticated users', () => {
            const result = callAuthorized(null, '/tree')
            expect(result).toBe(true)
        })

        it('allows access to /search for unauthenticated users', () => {
            const result = callAuthorized(null, '/search')
            expect(result).toBe(true)
        })

        // Dashboard routes
        it('blocks unauthenticated users from /dashboard', () => {
            const result = callAuthorized(null, '/dashboard')
            expect(result).toBe(false)
        })

        it('allows authenticated users to access /dashboard', () => {
            const result = callAuthorized({ user: { role: 'VIEWER' } }, '/dashboard')
            expect(result).toBe(true)
        })

        // Admin routes
        it('blocks unauthenticated users from /admin', () => {
            const result = callAuthorized(null, '/admin')
            expect(result).toBe(false)
        })

        it('redirects non-admin authenticated users from /admin', () => {
            const result = callAuthorized({ user: { role: 'VIEWER' } }, '/admin')
            expect(result).toBeInstanceOf(Response)
            if (result instanceof Response) {
                expect(result.status).toBe(302)
                const location = result.headers.get('Location')
                expect(location).toContain('/')
            }
        })

        it('redirects CONTRIBUTOR from /admin', () => {
            const result = callAuthorized({ user: { role: 'CONTRIBUTOR' } }, '/admin')
            expect(result).toBeInstanceOf(Response)
        })

        it('redirects VERIFIER from /admin', () => {
            const result = callAuthorized({ user: { role: 'VERIFIER' } }, '/admin')
            expect(result).toBeInstanceOf(Response)
        })

        it('allows ADMIN to access /admin', () => {
            const result = callAuthorized({ user: { role: 'ADMIN' } }, '/admin')
            expect(result).toBe(true)
        })

        it('allows ADMIN to access /admin/users', () => {
            const result = callAuthorized({ user: { role: 'ADMIN' } }, '/admin/users')
            expect(result).toBe(true)
        })
    })

    describe('session callback', () => {
        it('enriches session with user id and role from token', () => {
            const session = { user: { id: '', role: undefined } } as any
            const token = { sub: 'user-123', role: 'CONTRIBUTOR' }
            const result = (authConfig.callbacks as any).session({ session, token })
            expect(result.user.id).toBe('user-123')
            expect(result.user.role).toBe('CONTRIBUTOR')
        })

        it('does not set id if token.sub is missing', () => {
            const session = { user: { id: 'original' } } as any
            const token = { role: 'VIEWER' }
            const result = (authConfig.callbacks as any).session({ session, token })
            // token.sub is falsy so condition fails
            expect(result.user.id).toBe('original')
        })

        it('handles missing session.user gracefully', () => {
            const session = {} as any
            const token = { sub: 'user-456', role: 'ADMIN' }
            const result = (authConfig.callbacks as any).session({ session, token })
            // session.user is falsy so the if block is skipped
            expect(result.user).toBeUndefined()
        })
    })

    describe('jwt callback', () => {
        it('sets token.sub and token.role when user is provided (login)', () => {
            const token = {} as any
            const user = { id: 'user-789', role: 'VERIFIER' }
            const result = (authConfig.callbacks as any).jwt({ token, user })
            expect(result.sub).toBe('user-789')
            expect(result.role).toBe('VERIFIER')
        })

        it('preserves existing token when user is not provided (subsequent requests)', () => {
            const token = { sub: 'user-789', role: 'VERIFIER' } as any
            const result = (authConfig.callbacks as any).jwt({ token, user: undefined })
            expect(result.sub).toBe('user-789')
            expect(result.role).toBe('VERIFIER')
        })

        it('does not overwrite token fields when no user on refresh', () => {
            const token = { sub: 'existing', role: 'ADMIN', iat: 12345 } as any
            const result = (authConfig.callbacks as any).jwt({ token })
            expect(result.sub).toBe('existing')
            expect(result.role).toBe('ADMIN')
            expect(result.iat).toBe(12345)
        })
    })

    describe('configuration', () => {
        it('uses JWT session strategy', () => {
            expect(authConfig.session?.strategy).toBe('jwt')
        })

        it('has custom signIn page set to /login', () => {
            expect(authConfig.pages?.signIn).toBe('/login')
        })

        it('has empty providers (providers are set in auth.ts)', () => {
            expect(authConfig.providers).toEqual([])
        })
    })
})
