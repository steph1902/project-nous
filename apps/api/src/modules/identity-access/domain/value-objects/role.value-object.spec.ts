import { Role, RoleHierarchy, hasEqualOrHigherRole } from './role.value-object';

describe('Role', () => {
    describe('RoleHierarchy', () => {
        it('should return correct hierarchy level for each role', () => {
            expect(RoleHierarchy[Role.OWNER]).toBe(4);
            expect(RoleHierarchy[Role.ADMIN]).toBe(3);
            expect(RoleHierarchy[Role.OPERATOR]).toBe(2);
            expect(RoleHierarchy[Role.VIEWER]).toBe(1);
        });
    });

    describe('hasEqualOrHigherRole', () => {
        it('should allow OWNER to access any role', () => {
            expect(hasEqualOrHigherRole(Role.OWNER, Role.OWNER)).toBe(true);
            expect(hasEqualOrHigherRole(Role.OWNER, Role.ADMIN)).toBe(true);
            expect(hasEqualOrHigherRole(Role.OWNER, Role.OPERATOR)).toBe(true);
            expect(hasEqualOrHigherRole(Role.OWNER, Role.VIEWER)).toBe(true);
        });

        it('should allow ADMIN to access ADMIN and below', () => {
            expect(hasEqualOrHigherRole(Role.ADMIN, Role.OWNER)).toBe(false);
            expect(hasEqualOrHigherRole(Role.ADMIN, Role.ADMIN)).toBe(true);
            expect(hasEqualOrHigherRole(Role.ADMIN, Role.OPERATOR)).toBe(true);
            expect(hasEqualOrHigherRole(Role.ADMIN, Role.VIEWER)).toBe(true);
        });

        it('should allow OPERATOR to access OPERATOR and below', () => {
            expect(hasEqualOrHigherRole(Role.OPERATOR, Role.OWNER)).toBe(false);
            expect(hasEqualOrHigherRole(Role.OPERATOR, Role.ADMIN)).toBe(false);
            expect(hasEqualOrHigherRole(Role.OPERATOR, Role.OPERATOR)).toBe(true);
            expect(hasEqualOrHigherRole(Role.OPERATOR, Role.VIEWER)).toBe(true);
        });

        it('should allow VIEWER to access only VIEWER', () => {
            expect(hasEqualOrHigherRole(Role.VIEWER, Role.OWNER)).toBe(false);
            expect(hasEqualOrHigherRole(Role.VIEWER, Role.ADMIN)).toBe(false);
            expect(hasEqualOrHigherRole(Role.VIEWER, Role.OPERATOR)).toBe(false);
            expect(hasEqualOrHigherRole(Role.VIEWER, Role.VIEWER)).toBe(true);
        });
    });
});
