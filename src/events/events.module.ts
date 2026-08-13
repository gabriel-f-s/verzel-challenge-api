import { Module } from '@nestjs/common';
import { EventController } from './controllers/event.controller';
import { EventService } from './services/event.service';
import { PrismaModule } from '../database/prisma.module';
import { EventRepository } from './repositories/event.repository';

@Module({
  imports: [PrismaModule],
  controllers: [EventController],
  providers: [EventService, EventRepository],
  exports: [EventService],
})
export class EventsModule {}
