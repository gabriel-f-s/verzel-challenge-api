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
import { EventService } from '../services/event.service';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('events')
export class EventController {
  constructor(private readonly eventsService: EventService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ORGANIZADOR')
  create(
    @Body() createEventDto: CreateEventDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.eventsService.create(createEventDto, userId);
  }

  @Public()
  @Get()
  findAll(@Query('type') type?: string, @Query('source') source?: string) {
    return this.eventsService.findAll({ type, source });
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
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
  @UseGuards(RolesGuard)
  @Roles('ORGANIZADOR')
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.eventsService.remove(id, userId);
  }
}
