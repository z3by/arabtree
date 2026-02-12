import { describe, it, expect } from 'vitest'
import { hasRole, requireRole, ROLE_HIERARCHY } from '@/lib/rbac'

describe('ROLE_HIERARCHY', () => {
    it('defines the correct hierarchy values', () => {
        expect(ROLE_HIERARCHY.VIEWER).toBe(0)
        expect(ROLE_HIERARCHY.CONTRIBUTOR).toBe(1)
        expect(ROLE_HIERARCHY.VERIFIER).toBe(2)
        expect(ROLE_HIERARCHY.ADMIN).toBe(3)
    })

    it('has strictly increasing values', () => {
        expect(ROLE_HIERARCHY.VIEWER).toBeLessThan(ROLE_HIERARCHY.CONTRIBUTOR)
        expect(ROLE_HIERARCHY.CONTRIBUTOR).toBeLessThan(ROLE_HIERARCHY.VERIFIER)
        expect(ROLE_HIERARCHY.VERIFIER).toBeLessThan(ROLE_HIERARCHY.ADMIN)
    })
})

describe('hasRole', () => {
    it('returns true when user role matches required role', () => {
        expect(hasRole('VIEWER', 'VIEWER')).toBe(true)
        expect(hasRole('ADMIN', 'ADMIN')).toBe(true)
        expect(hasRole('VERIFIER', 'VERIFIER')).toBe(true)
    })

    it('returns true when user role exceeds required role', () => {
        expect(hasRole('ADMIN', 'VIEWER')).toBe(true)
        expect(hasRole('ADMIN', 'CONTRIBUTOR')).toBe(true)
        expect(hasRole('ADMIN', 'VERIFIER')).toBe(true)
        expect(hasRole('VERIFIER', 'CONTRIBUTOR')).toBe(true)
        expect(hasRole('VERIFIER', 'VIEWER')).toBe(true)
        expect(hasRole('CONTRIBUTOR', 'VIEWER')).toBe(true)
    })

    it('returns false when user role is below required role', () => {
        expect(hasRole('VIEWER', 'CONTRIBUTOR')).toBe(false)
        expect(hasRole('VIEWER', 'VERIFIER')).toBe(false)
        expect(hasRole('VIEWER', 'ADMIN')).toBe(false)
        expect(hasRole('CONTRIBUTOR', 'VERIFIER')).toBe(false)
        expect(hasRole('CONTRIBUTOR', 'ADMIN')).toBe(false)
        expect(hasRole('VERIFIER', 'ADMIN')).toBe(false)
    })
})

describe('requireRole', () => {
    it('does not throw when user has sufficient role', () => {
        expect(() => requireRole('ADMIN', 'ADMIN')).not.toThrow()
        expect(() => requireRole('ADMIN', 'VIEWER')).not.toThrow()
        expect(() => requireRole('VERIFIER', 'CONTRIBUTOR')).not.toThrow()
    })

    it('throws an error when user has insufficient role', () => {
        expect(() => requireRole('VIEWER', 'ADMIN')).toThrow('Forbidden: Insufficient permissions')
        expect(() => requireRole('VIEWER', 'CONTRIBUTOR')).toThrow('Forbidden: Insufficient permissions')
        expect(() => requireRole('CONTRIBUTOR', 'VERIFIER')).toThrow('Forbidden: Insufficient permissions')
    })
})
