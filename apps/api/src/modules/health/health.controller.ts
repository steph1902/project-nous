import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
    @Get()
    @ApiOperation({ summary: 'Health check endpoint' })
    check() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: 'agentops-api',
            version: '0.1.0',
        };
    }
}
