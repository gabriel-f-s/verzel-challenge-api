import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TicketRepository } from '../repositories/ticket.repository';
import { EventService } from '../../events/services/event.service';
import { QrCodeService } from './qr-code.service';
import { PurchaseTicketDto } from '../dto/purchase-ticket.dto';
import { ValidateTicketDto } from '../dto/validate-ticket.dto';
import { TicketStatus } from '../domain/enums/ticket-status.enum';
import { ValidationStatus } from '../domain/enums/validation-status.enum';
import { Type } from '../../events/domain/enums/type.enum';
import { randomUUID } from 'crypto';

import { Event } from '../../events/domain/entities/event.entity';

@Injectable()
export class TicketService {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly eventService: EventService,
    private readonly qrCodeService: QrCodeService,
  ) {}

  async purchaseTicket(dto: PurchaseTicketDto, clientId: string) {
    const event = await this.eventService.findOne(dto.eventId);
    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    const activeTicketsCount =
      await this.ticketRepository.countActiveTicketsByEvent(event.id);
    if (activeTicketsCount >= event.capacity) {
      throw new BadRequestException(
        'Este evento já atingiu a capacidade máxima e está esgotado.',
      );
    }

    const isSeated = event.type === Type.SEATED;
    if (isSeated && !dto.seatNumber) {
      throw new BadRequestException(
        'Este evento possui assentos marcados. É obrigatório selecionar um assento.',
      );
    }

    // Simulação de Recusa de Pagamento
    if (dto.simulatePaymentSuccess === false) {
      throw new BadRequestException(
        'Transação não autorizada. O pagamento simulado foi recusado pela operadora de cartão.',
      );
    }

    const seed = randomUUID();
    const qrCodeSignature = this.qrCodeService.generateSignature({
      eventId: event.id,
      clientId,
      seed,
    });
    const shareToken = randomUUID();

    const ticket = await this.ticketRepository.acquireSeatAndCreateTicket(
      {
        eventId: event.id,
        clientId,
        seatNumber: isSeated ? dto.seatNumber : undefined,
        qrCodeSignature,
        shareToken,
        status: TicketStatus.PAID,
        reservedUntil: undefined,
      },
      isSeated,
    );

    const qrCodeData = this.qrCodeService.generateQrPayload({
      id: ticket.id,
      eventId: ticket.eventId,
      qrCodeSignature: ticket.qrCodeSignature,
    });

    return {
      id: ticket.id,
      eventId: ticket.eventId,
      eventTitle: event.title,
      eventDate: event.date,
      eventLocation: event.location,
      eventImageUrl: event.imageUrl,
      price: event.price,
      seatNumber: ticket.seatNumber,
      status: ticket.status,
      shareToken: ticket.shareToken,
      qrCodeData,
      createdAt: ticket.createdAt,
    };
  }

  async getMyTickets(clientId: string) {
    const tickets = await this.ticketRepository.findByClientId(clientId);

    return Promise.all(
      tickets.map(async (ticket) => {
        let event: Event | null = null;
        try {
          event = await this.eventService.findOne(ticket.eventId);
        } catch {
          // Event might have been deleted or archived
        }

        const qrCodeData = this.qrCodeService.generateQrPayload({
          id: ticket.id,
          eventId: ticket.eventId,
          qrCodeSignature: ticket.qrCodeSignature,
        });

        return {
          id: ticket.id,
          eventId: ticket.eventId,
          eventTitle: event?.title || 'Evento',
          eventDate: event?.date,
          eventLocation: event?.location,
          eventImageUrl: event?.imageUrl,
          price: event?.price,
          seatNumber: ticket.seatNumber,
          status: ticket.status,
          shareToken: ticket.shareToken,
          qrCodeData,
          validatedAt: ticket.validatedAt,
          createdAt: ticket.createdAt,
        };
      }),
    );
  }

  async getOccupiedSeats(eventId: string): Promise<string[]> {
    await this.eventService.findOne(eventId);
    return this.ticketRepository.findOccupiedSeats(eventId);
  }

  async getByShareToken(shareToken: string) {
    const ticket = await this.ticketRepository.findByShareToken(shareToken);
    if (!ticket) {
      throw new NotFoundException('Ingresso compartilhado não encontrado');
    }

    const event = await this.eventService.findOne(ticket.eventId);

    const qrCodeData = this.qrCodeService.generateQrPayload({
      id: ticket.id,
      eventId: ticket.eventId,
      qrCodeSignature: ticket.qrCodeSignature,
    });

    return {
      id: ticket.id,
      eventTitle: event.title,
      eventDescription: event.description,
      eventDate: event.date,
      eventLocation: event.location,
      eventImageUrl: event.imageUrl,
      seatNumber: ticket.seatNumber,
      status: ticket.status,
      shareToken: ticket.shareToken,
      qrCodeData,
      validatedAt: ticket.validatedAt,
    };
  }

  async validateTicket(dto: ValidateTicketDto, validatorUserId: string) {
    let ticketId: string | null = null;
    let qrSignature: string | null = null;

    try {
      const parsed = JSON.parse(dto.qrCodeData);
      ticketId = parsed.id;
      qrSignature = parsed.signature;
    } catch {
      // Se não for JSON, pode ser o ID direto ou o shareToken digitado manualmente
      ticketId = dto.qrCodeData.trim();
    }

    let ticket = ticketId
      ? await this.ticketRepository.findById(ticketId)
      : null;

    if (!ticket && qrSignature) {
      ticket = await this.ticketRepository.findByQrCodeSignature(qrSignature);
    }

    if (!ticket && dto.qrCodeData) {
      ticket = await this.ticketRepository.findByShareToken(
        dto.qrCodeData.trim(),
      );
    }

    if (!ticket) {
      return {
        status: ValidationStatus.INVALID,
        message: 'Ingresso inválido ou código não encontrado.',
        ticket: null,
      };
    }

    const event = await this.eventService
      .findOne(ticket.eventId)
      .catch(() => null);

    const validationResult = ticket.validate(dto.eventId, validatorUserId);

    if (validationResult === ValidationStatus.VALID) {
      await this.ticketRepository.updateStatus(
        ticket.id,
        TicketStatus.VALIDATED,
        ticket.validatedAt,
        ticket.validatedById,
      );

      return {
        status: ValidationStatus.VALID,
        message: 'Ingresso válido! Entrada autorizada com sucesso.',
        ticket: {
          id: ticket.id,
          eventTitle: event?.title,
          seatNumber: ticket.seatNumber,
          validatedAt: ticket.validatedAt,
        },
      };
    }

    if (validationResult === ValidationStatus.ALREADY_USED) {
      return {
        status: ValidationStatus.ALREADY_USED,
        message: `Atenção: Este ingresso já foi validado anteriormente em ${ticket.validatedAt?.toLocaleString('pt-BR')}.`,
        ticket: {
          id: ticket.id,
          eventTitle: event?.title,
          seatNumber: ticket.seatNumber,
          validatedAt: ticket.validatedAt,
        },
      };
    }

    if (validationResult === ValidationStatus.WRONG_EVENT) {
      return {
        status: ValidationStatus.WRONG_EVENT,
        message:
          'Atenção: Este ingresso é válido, mas pertence a outro evento/sessão diferente.',
        ticket: {
          id: ticket.id,
          eventTitle: event?.title,
          seatNumber: ticket.seatNumber,
        },
      };
    }

    return {
      status: ValidationStatus.INVALID,
      message: 'Ingresso inválido, não pago ou cancelado.',
      ticket: null,
    };
  }
}
