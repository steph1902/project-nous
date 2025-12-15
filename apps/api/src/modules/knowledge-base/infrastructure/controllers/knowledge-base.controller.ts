import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    Query,
    UseGuards,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { IngestDocumentUseCase } from '../../application/use-cases/ingest-document.use-case';
import { QueryKnowledgeBaseUseCase } from '../../application/use-cases/query-kb.use-case';
import { ListDocumentsUseCase } from '../../application/use-cases/list-documents.use-case';
import { JwtAuthGuard } from '@/modules/identity-access/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '@/modules/identity-access/infrastructure/auth/roles.guard';
import { CurrentUser } from '@/modules/identity-access/infrastructure/auth/current-user.decorator';
import { Roles } from '@/modules/identity-access/infrastructure/auth/roles.decorator';
import { Role } from '@/modules/identity-access/domain/value-objects/role.value-object';
import { AuthUser } from '@/modules/identity-access/infrastructure/auth/jwt.strategy';
import { SourceType } from '../../domain/entities/kb-document.entity';

// DTOs
class IngestDocumentDto {
    title!: string;
    sourceType!: SourceType;
    s3Key!: string;
    tags?: string[];
}

class QueryKbDto {
    query!: string;
    topK?: number;
    tags?: string[];
}

@ApiTags('Knowledge Base')
@Controller('kb')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class KnowledgeBaseController {
    constructor(
        private readonly ingestDocument: IngestDocumentUseCase,
        private readonly queryKb: QueryKnowledgeBaseUseCase,
        private readonly listDocuments: ListDocumentsUseCase
    ) { }

    @Post('documents')
    @Roles(Role.OPERATOR)
    @ApiOperation({ summary: 'Ingest a new document' })
    async ingest(@Body() dto: IngestDocumentDto, @CurrentUser() user: AuthUser) {
        if (!user.orgId) {
            throw new HttpException('Org context required', HttpStatus.BAD_REQUEST);
        }

        const result = await this.ingestDocument.execute({
            orgId: user.orgId,
            title: dto.title,
            sourceType: dto.sourceType,
            s3Key: dto.s3Key,
            tags: dto.tags,
        });

        return result;
    }

    @Get('documents')
    @ApiOperation({ summary: 'List documents' })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'cursor', required: false, type: String })
    @ApiQuery({ name: 'tags', required: false, type: String })
    async list(
        @CurrentUser() user: AuthUser,
        @Query('limit') limit?: string,
        @Query('cursor') cursor?: string,
        @Query('tags') tags?: string
    ) {
        if (!user.orgId) {
            throw new HttpException('Org context required', HttpStatus.BAD_REQUEST);
        }

        const result = await this.listDocuments.execute({
            orgId: user.orgId,
            limit: limit ? parseInt(limit, 10) : undefined,
            cursor,
            tags: tags ? tags.split(',') : undefined,
        });

        return result;
    }

    @Post('query')
    @ApiOperation({ summary: 'Query the knowledge base' })
    async query(@Body() dto: QueryKbDto, @CurrentUser() user: AuthUser) {
        if (!user.orgId) {
            throw new HttpException('Org context required', HttpStatus.BAD_REQUEST);
        }

        const result = await this.queryKb.execute({
            orgId: user.orgId,
            query: dto.query,
            topK: dto.topK,
            tags: dto.tags,
        });

        return result;
    }
}
