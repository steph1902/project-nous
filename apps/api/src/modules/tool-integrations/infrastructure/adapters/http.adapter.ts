import { Injectable, OnModuleInit } from '@nestjs/common';
import { ToolAdapter, ToolRequest, ToolResponse, ToolGatewayService } from '../../domain/services/tool-gateway.service';
import { IntegrationType } from '../../domain/entities/integration.entity';

@Injectable()
export class HttpToolAdapter implements ToolAdapter, OnModuleInit {
    type: IntegrationType = 'HTTP';

    constructor(private readonly toolGateway: ToolGatewayService) { }

    onModuleInit() {
        this.toolGateway.registerAdapter(this);
    }

    async execute(
        request: ToolRequest,
        config: Record<string, unknown>,
        secrets: Record<string, string>
    ): Promise<ToolResponse> {
        const startTime = Date.now();

        try {
            const baseUrl = config.baseUrl as string;
            const method = (request.params.method as string)?.toUpperCase() || 'GET';
            const path = (request.params.path as string) || '';
            const body = request.params.body;
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                ...(config.headers as Record<string, string> || {}),
            };

            // Add auth header if API key secret exists
            if (secrets.apiKey) {
                headers['Authorization'] = `Bearer ${secrets.apiKey}`;
            }

            const url = `${baseUrl}${path}`;

            const response = await fetch(url, {
                method,
                headers,
                body: body ? JSON.stringify(body) : undefined,
            });

            const contentType = response.headers.get('content-type');
            let data: unknown;

            if (contentType?.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            return {
                success: response.ok,
                data,
                durationMs: Date.now() - startTime,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'HTTP request failed',
                durationMs: Date.now() - startTime,
            };
        }
    }
}
