import { Injectable } from '@nestjs/common';
import { ApiKeyRepository } from '../../infrastructure/persistence/api-key.repository';
import { InvalidApiKeyError } from '../../domain/errors';
import { Role } from '../../domain/value-objects/role.value-object';

export interface ValidateApiKeyQuery {
    apiKey: string;
}

export interface ValidateApiKeyResult {
    orgId: string;
    userId: string;
    role: Role;
    scopes: string[];
}

@Injectable()
export class ValidateApiKeyUseCase {
    constructor(private readonly apiKeyRepository: ApiKeyRepository) { }

    async execute(query: ValidateApiKeyQuery): Promise<ValidateApiKeyResult> {
        const apiKeyData = await this.apiKeyRepository.findByKey(query.apiKey);

        if (!apiKeyData) {
            throw new InvalidApiKeyError();
        }

        // Check if expired
        if (apiKeyData.expiresAt && apiKeyData.expiresAt < new Date()) {
            throw new InvalidApiKeyError();
        }

        // Update last used
        await this.apiKeyRepository.updateLastUsed(apiKeyData.id);

        return {
            orgId: apiKeyData.orgId,
            userId: apiKeyData.userId,
            role: apiKeyData.role,
            scopes: apiKeyData.scopes,
        };
    }
}
