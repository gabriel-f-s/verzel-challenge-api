import {
  Controller,
  Get,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { IntegrationsService } from './services/integrations.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Integrations')
@ApiBearerAuth()
@Controller('integrations')
@UseGuards(RolesGuard)
@Roles('ORGANIZADOR')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get('search')
  @ApiOperation({
    summary: 'Busca eventos em APIs externas',
    description:
      'Pesquisa um catálogo (ex: TMDB) por query para fornecer dados ao organizador.',
  })
  @ApiQuery({ name: 'query', description: 'Termo de busca (ex: Batman)' })
  @ApiQuery({ name: 'source', description: 'Fonte externa', enum: ['TMDB'] })
  async search(@Query('query') query: string, @Query('source') source: string) {
    if (!query) throw new BadRequestException('A query de busca é obrigatória');
    if (!source)
      throw new BadRequestException('A fonte (source) é obrigatória');
    return this.integrationsService.search(query, source);
  }
}
