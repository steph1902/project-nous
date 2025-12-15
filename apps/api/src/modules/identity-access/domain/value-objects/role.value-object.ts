/**
 * Role Value Object - RBAC roles for organization members
 */
export enum Role {
    OWNER = 'OWNER',
    ADMIN = 'ADMIN',
    OPERATOR = 'OPERATOR',
    VIEWER = 'VIEWER',
}

export const RoleHierarchy: Record<Role, number> = {
    [Role.OWNER]: 4,
    [Role.ADMIN]: 3,
    [Role.OPERATOR]: 2,
    [Role.VIEWER]: 1,
};

export function hasEqualOrHigherRole(userRole: Role, requiredRole: Role): boolean {
    return RoleHierarchy[userRole] >= RoleHierarchy[requiredRole];
}
