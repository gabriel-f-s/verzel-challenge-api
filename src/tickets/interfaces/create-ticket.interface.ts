import { TicketStatus } from '../domain/enums/ticket-status.enum';

export interface CreateTicket {
  eventId: string;
  clientId: string;
  seatNumber?: string;
  qrCodeSignature: string;
  shareToken: string;
  status: TicketStatus;
  reservedUntil?: Date;
}
