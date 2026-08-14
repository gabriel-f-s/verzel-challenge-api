import {
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Ticket } from '../domain/entities/ticket.entity';
import { CreateTicket } from '../interfaces/create-ticket.interface';
import { TicketStatus } from '../domain/enums/ticket-status.enum';
import { Ticket as TicketPrisma } from '@prisma/client';

@Injectable()
export class TicketRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTicket): Promise<Ticket> {
    const created: TicketPrisma = await this.prisma.ticket.create({
      data: {
        eventId: data.eventId,
        clientId: data.clientId,
        seatNumber: data.seatNumber,
        qrCodeSignature: data.qrCodeSignature,
        shareToken: data.shareToken,
        status: data.status,
        reservedUntil: data.reservedUntil,
      },
    });
    return this.mapToEntity(created);
  }

  async findById(id: string): Promise<Ticket | null> {
    const found = await this.prisma.ticket.findUnique({
      where: { id },
    });
    if (!found) return null;
    return this.mapToEntity(found);
  }

  async findByQrCodeSignature(qrCodeSignature: string): Promise<Ticket | null> {
    const found = await this.prisma.ticket.findUnique({
      where: { qrCodeSignature },
    });
    if (!found) return null;
    return this.mapToEntity(found);
  }

  async findByShareToken(shareToken: string): Promise<Ticket | null> {
    const found = await this.prisma.ticket.findUnique({
      where: { shareToken },
    });
    if (!found) return null;
    return this.mapToEntity(found);
  }

  async findByClientId(clientId: string): Promise<Ticket[]> {
    const tickets = await this.prisma.ticket.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
    });
    return tickets.map((t: TicketPrisma) => this.mapToEntity(t));
  }

  async findOccupiedSeats(eventId: string): Promise<string[]> {
    const now = new Date();
    const activeTickets = await this.prisma.ticket.findMany({
      where: {
        eventId,
        seatNumber: { not: null },
        status: { in: ['PAID', 'VALIDATED', 'RESERVED'] },
      },
      select: {
        seatNumber: true,
        status: true,
        reservedUntil: true,
      },
    });

    return activeTickets
      .filter((t) => {
        return !(
          t.status === 'RESERVED' &&
          t.reservedUntil &&
          t.reservedUntil < now
        );
      })
      .map((t) => t.seatNumber as string);
  }

  async countActiveTicketsByEvent(eventId: string): Promise<number> {
    const now = new Date();
    const tickets = await this.prisma.ticket.findMany({
      where: {
        eventId,
        status: { in: ['PAID', 'VALIDATED', 'RESERVED'] },
      },
      select: {
        status: true,
        reservedUntil: true,
      },
    });

    return tickets.filter((t) => {
      if (t.status === 'RESERVED' && t.reservedUntil && t.reservedUntil < now) {
        return false;
      }
      return true;
    }).length;
  }

  async updateStatus(
    id: string,
    status: TicketStatus,
    validatedAt?: Date | null,
    validatedById?: string | null,
  ): Promise<Ticket> {
    const updated = await this.prisma.ticket.update({
      where: { id },
      data: {
        status,
        ...(validatedAt !== undefined && { validatedAt }),
        ...(validatedById !== undefined && { validatedById }),
      },
    });
    return this.mapToEntity(updated);
  }

  async acquireSeatAndCreateTicket(
    data: CreateTicket,
    isSeated: boolean,
  ): Promise<Ticket> {
    return this.prisma.$transaction(async (tx) => {
      const now = new Date();

      if (isSeated && data.seatNumber) {
        const existing = await tx.ticket.findFirst({
          where: {
            eventId: data.eventId,
            seatNumber: data.seatNumber,
            status: { in: ['PAID', 'VALIDATED', 'RESERVED'] },
          },
        });

        if (existing) {
          if (
            existing.status === 'RESERVED' &&
            existing.reservedUntil &&
            existing.reservedUntil < now
          ) {
            await tx.ticket.update({
              where: { id: existing.id },
              data: { status: 'CANCELLED' },
            });
          } else {
            throw new ConflictException(
              `O assento "${data.seatNumber}" já foi reservado ou adquirido por outro cliente.`,
            );
          }
        }
      }

      const created = await tx.ticket.create({
        data: {
          eventId: data.eventId,
          clientId: data.clientId,
          seatNumber: data.seatNumber,
          qrCodeSignature: data.qrCodeSignature,
          shareToken: data.shareToken,
          status: data.status,
          reservedUntil: data.reservedUntil,
        },
      });

      return this.mapToEntity(created);
    });
  }

  private mapToEntity(ticket: TicketPrisma): Ticket {
    return new Ticket({
      id: ticket.id,
      eventId: ticket.eventId,
      clientId: ticket.clientId,
      seatNumber: ticket.seatNumber ?? undefined,
      qrCodeSignature: ticket.qrCodeSignature,
      shareToken: ticket.shareToken,
      status: ticket.status as TicketStatus,
      reservedUntil: ticket.reservedUntil ?? undefined,
      validatedAt: ticket.validatedAt ?? undefined,
      validatedById: ticket.validatedById ?? undefined,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    });
  }
}
