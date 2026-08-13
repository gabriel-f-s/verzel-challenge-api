import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { IntegrationsService } from './services/integrations.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

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
    description: 'Pesquisa um catálogo (ex: TMDB) por query.',
  })
  @ApiQuery({ name: 'query', description: 'Termo de busca (ex: Batman)' })
  @ApiQuery({ name: 'source', description: 'Fonte externa', enum: ['TMDB'] })
  async search(@Query('query') query: string, @Query('source') source: string) {
    if (!query) throw new BadRequestException('A query de busca é obrigatória');
    if (!source)
      throw new BadRequestException('A fonte (source) é obrigatória');
    return this.integrationsService.search(query, source);
  }

  @Post('import/:source/:id')
  @ApiOperation({
    summary: 'Importa um evento externo',
    description:
      'Salva o evento externo diretamente no banco de dados vinculando-o ao organizador.',
  })
  @ApiParam({
    name: 'source',
    description: 'Fonte externa (ex: TMDB)',
    type: String,
  })
  @ApiParam({
    name: 'id',
    description: 'ID do evento na API externa',
    type: String,
  })
  async importEvent(
    @Param('source') source: string,
    @Param('id') externalId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.integrationsService.importEvent(source, externalId, userId);
  }
}
