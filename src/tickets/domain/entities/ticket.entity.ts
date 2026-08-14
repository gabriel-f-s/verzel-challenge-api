import { TicketStatus } from '../enums/ticket-status.enum';
import { ValidationStatus } from '../enums/validation-status.enum';

export class Ticket {
  id: string;
  eventId: string;
  clientId: string;
  seatNumber?: string;
  qrCodeSignature: string;
  shareToken: string;
  status: TicketStatus;
  reservedUntil?: Date;
  validatedAt?: Date;
  validatedById?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Ticket>) {
    this.id = partial.id ?? '';
    this.eventId = partial.eventId ?? '';
    this.clientId = partial.clientId ?? '';
    this.seatNumber = partial.seatNumber;
    this.qrCodeSignature = partial.qrCodeSignature ?? '';
    this.shareToken = partial.shareToken ?? '';
    this.status = partial.status ?? TicketStatus.RESERVED;
    this.reservedUntil = partial.reservedUntil;
    this.validatedAt = partial.validatedAt;
    this.validatedById = partial.validatedById;
    this.createdAt = partial.createdAt ?? new Date();
    this.updatedAt = partial.updatedAt ?? new Date();
  }

  validate(eventId: string, validatorUserId: string): ValidationStatus {
    if (this.eventId !== eventId) {
      return ValidationStatus.WRONG_EVENT;
    }

    if (this.status === TicketStatus.VALIDATED) {
      return ValidationStatus.ALREADY_USED;
    }

    if (this.status !== TicketStatus.PAID) {
      return ValidationStatus.INVALID;
    }

    this.status = TicketStatus.VALIDATED;
    this.validatedAt = new Date();
    this.validatedById = validatorUserId;

    return ValidationStatus.VALID;
  }
}
