import { Test, TestingModule } from '@nestjs/testing';
import { TicketService } from './ticket.service';
import { TicketRepository } from '../repositories/ticket.repository';
import { EventService } from '../../events/services/event.service';
import { QrCodeService } from './qr-code.service';

describe('TicketService', () => {
  let service: TicketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketService,
        { provide: TicketRepository, useValue: {} },
        { provide: EventService, useValue: {} },
        { provide: QrCodeService, useValue: {} },
      ],
    }).compile();

    service = module.get<TicketService>(TicketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
