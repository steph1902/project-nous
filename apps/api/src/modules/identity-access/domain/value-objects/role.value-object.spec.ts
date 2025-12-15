import { Role, getRoleHierarchy, hasPermission } from './role.value-object';

describe('Role', () => {
    describe('getRoleHierarchy', () => {
        it('should return correct hierarchy level for each role', () => {
            expect(getRoleHierarchy(Role.OWNER)).toBe(4);
            expect(getRoleHierarchy(Role.ADMIN)).toBe(3);
            expect(getRoleHierarchy(Role.OPERATOR)).toBe(2);
            expect(getRoleHierarchy(Role.VIEWER)).toBe(1);
        });
    });

    describe('hasPermission', () => {
        it('should allow OWNER to access any role', () => {
            expect(hasPermission(Role.OWNER, Role.OWNER)).toBe(true);
            expect(hasPermission(Role.OWNER, Role.ADMIN)).toBe(true);
            expect(hasPermission(Role.OWNER, Role.OPERATOR)).toBe(true);
            expect(hasPermission(Role.OWNER, Role.VIEWER)).toBe(true);
        });

        it('should allow ADMIN to access ADMIN and below', () => {
            expect(hasPermission(Role.ADMIN, Role.OWNER)).toBe(false);
            expect(hasPermission(Role.ADMIN, Role.ADMIN)).toBe(true);
            expect(hasPermission(Role.ADMIN, Role.OPERATOR)).toBe(true);
            expect(hasPermission(Role.ADMIN, Role.VIEWER)).toBe(true);
        });

        it('should allow OPERATOR to access OPERATOR and below', () => {
            expect(hasPermission(Role.OPERATOR, Role.OWNER)).toBe(false);
            expect(hasPermission(Role.OPERATOR, Role.ADMIN)).toBe(false);
            expect(hasPermission(Role.OPERATOR, Role.OPERATOR)).toBe(true);
            expect(hasPermission(Role.OPERATOR, Role.VIEWER)).toBe(true);
        });

        it('should allow VIEWER to access only VIEWER', () => {
            expect(hasPermission(Role.VIEWER, Role.OWNER)).toBe(false);
            expect(hasPermission(Role.VIEWER, Role.ADMIN)).toBe(false);
            expect(hasPermission(Role.VIEWER, Role.OPERATOR)).toBe(false);
            expect(hasPermission(Role.VIEWER, Role.VIEWER)).toBe(true);
        });
    });
});
