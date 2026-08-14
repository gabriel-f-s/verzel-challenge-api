import { Module } from '@nestjs/common';
import { TicketController } from './controllers/ticket.controller';
import { TicketService } from './services/ticket.service';
import { TicketRepository } from './repositories/ticket.repository';
import { QrCodeService } from './services/qr-code.service';
import { PrismaModule } from '../database/prisma.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [PrismaModule, EventsModule],
  controllers: [TicketController],
  providers: [TicketService, TicketRepository, QrCodeService],
  exports: [TicketService],
})
export class TicketsModule {}
