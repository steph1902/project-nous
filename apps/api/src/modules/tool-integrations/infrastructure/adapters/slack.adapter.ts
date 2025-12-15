import { Injectable, OnModuleInit } from '@nestjs/common';
import { ToolAdapter, ToolRequest, ToolResponse, ToolGatewayService } from '../../domain/services/tool-gateway.service';
import { IntegrationType } from '../../domain/entities/integration.entity';

@Injectable()
export class SlackToolAdapter implements ToolAdapter, OnModuleInit {
    type: IntegrationType = 'SLACK';

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
            const action = request.action;
            const botToken = secrets.botToken;

            if (!botToken) {
                return {
                    success: false,
                    error: 'Bot token not configured',
                    durationMs: Date.now() - startTime,
                };
            }

            let response: Response;
            let data: unknown;

            switch (action) {
                case 'postMessage':
                    response = await fetch('https://slack.com/api/chat.postMessage', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${botToken}`,
                        },
                        body: JSON.stringify({
                            channel: request.params.channel,
                            text: request.params.text,
                            blocks: request.params.blocks,
                        }),
                    });
                    data = await response.json();
                    break;

                case 'getChannels':
                    response = await fetch('https://slack.com/api/conversations.list', {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${botToken}`,
                        },
                    });
                    data = await response.json();
                    break;

                case 'getUsers':
                    response = await fetch('https://slack.com/api/users.list', {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${botToken}`,
                        },
                    });
                    data = await response.json();
                    break;

                default:
                    return {
                        success: false,
                        error: `Unknown action: ${action}`,
                        durationMs: Date.now() - startTime,
                    };
            }

            return {
                success: true,
                data,
                durationMs: Date.now() - startTime,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Slack API call failed',
                durationMs: Date.now() - startTime,
            };
        }
    }
}
