import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { EventService } from '../services/event.service';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { ImportEventDto } from '../dto/import-event.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Events')
@Controller('events')
export class EventController {
  constructor(private readonly eventsService: EventService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cria um novo evento manual',
    description: 'Rota restrita a usuários Organizadores.',
  })
  @UseGuards(RolesGuard)
  @Roles('ORGANIZADOR')
  create(
    @Body() createEventDto: CreateEventDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.eventsService.create(createEventDto, userId);
  }

  @Post('import')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Importa um evento a partir de uma API externa (ex: TMDB)',
    description:
      'Busca os dados artísticos na API externa e mescla com os dados da sessão (data, local, preço, capacidade) definidos pelo organizador.',
  })
  @UseGuards(RolesGuard)
  @Roles('ORGANIZADOR')
  importEvent(
    @Body() importEventDto: ImportEventDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.eventsService.importFromExternal(importEventDto, userId);
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Lista os eventos disponíveis',
    description: 'Retorna um catálogo público de eventos.',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filtra eventos pelo tipo (ex: SEATED, GENERAL)',
  })
  @ApiQuery({
    name: 'source',
    required: false,
    description: 'Filtra eventos pela origem (ex: TMDB, CUSTOM)',
  })
  findAll(@Query('type') type?: string, @Query('source') source?: string) {
    return this.eventsService.findAll({ type, source });
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Busca um evento específico',
    description: 'Retorna detalhes completos de um único evento público.',
  })
  @ApiParam({ name: 'id', description: 'ID do evento', type: String })
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualiza dados de um evento',
    description: 'Restrito ao organizador que criou o evento.',
  })
  @ApiParam({ name: 'id', description: 'ID do evento' })
  @UseGuards(RolesGuard)
  @Roles('ORGANIZADOR')
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.eventsService.update(id, updateEventDto, userId);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Deleta um evento',
    description: 'Remove permanentemente o evento. Apenas para o criador.',
  })
  @ApiParam({ name: 'id', description: 'ID do evento' })
  @UseGuards(RolesGuard)
  @Roles('ORGANIZADOR')
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.eventsService.remove(id, userId);
  }
}
