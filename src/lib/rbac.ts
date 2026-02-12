import { UserRole } from '@prisma/client'

export const ROLE_HIERARCHY: Record<UserRole, number> = {
    VIEWER: 0,
    CONTRIBUTOR: 1,
    VERIFIER: 2,
    ADMIN: 3,
};

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
    return (ROLE_HIERARCHY[userRole] ?? 0) >= (ROLE_HIERARCHY[requiredRole] ?? 0);
}

export function requireRole(userRole: UserRole, requiredRole: UserRole) {
    if (!hasRole(userRole, requiredRole)) {
        throw new Error('Forbidden: Insufficient permissions');
    }
}
