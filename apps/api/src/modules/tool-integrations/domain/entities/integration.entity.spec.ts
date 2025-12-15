import { IntegrationEntity } from './integration.entity';

describe('IntegrationEntity', () => {
    describe('create', () => {
        it('should create a valid integration entity', () => {
            const integration = IntegrationEntity.create({
                id: 'int_123',
                orgId: 'org_456',
                name: 'Slack Bot',
                type: 'SLACK',
                configJson: { channel: '#general' },
                permissions: ['read', 'write'],
            });

            expect(integration.id).toBe('int_123');
            expect(integration.orgId).toBe('org_456');
            expect(integration.name).toBe('Slack Bot');
            expect(integration.type).toBe('SLACK');
            expect(integration.enabled).toBe(true);
            expect(integration.permissions).toEqual(['read', 'write']);
        });

        it('should throw error for empty name', () => {
            expect(() =>
                IntegrationEntity.create({
                    id: 'int_123',
                    orgId: 'org_456',
                    name: '',
                    type: 'HTTP',
                    configJson: {},
                })
            ).toThrow('Integration name cannot be empty');
        });

        it('should default to empty permissions array', () => {
            const integration = IntegrationEntity.create({
                id: 'int_123',
                orgId: 'org_456',
                name: 'Test',
                type: 'HTTP',
                configJson: {},
            });

            expect(integration.permissions).toEqual([]);
        });
    });

    describe('disable', () => {
        it('should return disabled integration', () => {
            const integration = IntegrationEntity.create({
                id: 'int_123',
                orgId: 'org_456',
                name: 'Test',
                type: 'HTTP',
                configJson: {},
            });

            const disabled = integration.disable();

            expect(disabled.enabled).toBe(false);
        });
    });

    describe('enable', () => {
        it('should return enabled integration', () => {
            const integration = IntegrationEntity.create({
                id: 'int_123',
                orgId: 'org_456',
                name: 'Test',
                type: 'HTTP',
                configJson: {},
            });

            const disabled = integration.disable();
            const enabled = disabled.enable();

            expect(enabled.enabled).toBe(true);
        });
    });

    describe('hasPermission', () => {
        it('should return true for matching permission', () => {
            const integration = IntegrationEntity.create({
                id: 'int_123',
                orgId: 'org_456',
                name: 'Test',
                type: 'HTTP',
                configJson: {},
                permissions: ['read', 'write'],
            });

            expect(integration.hasPermission('read')).toBe(true);
            expect(integration.hasPermission('write')).toBe(true);
        });

        it('should return false for non-matching permission', () => {
            const integration = IntegrationEntity.create({
                id: 'int_123',
                orgId: 'org_456',
                name: 'Test',
                type: 'HTTP',
                configJson: {},
                permissions: ['read'],
            });

            expect(integration.hasPermission('write')).toBe(false);
        });

        it('should return true for wildcard permission', () => {
            const integration = IntegrationEntity.create({
                id: 'int_123',
                orgId: 'org_456',
                name: 'Test',
                type: 'HTTP',
                configJson: {},
                permissions: ['*'],
            });

            expect(integration.hasPermission('anything')).toBe(true);
        });
    });
});
