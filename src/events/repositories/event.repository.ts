import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Event } from '../domain/entities/event.entity';
import { Type } from '../domain/enums/type.enum';
import { Event as EventPrisma } from '@prisma/client';
import { CreateEvent } from '../interfaces/create-event.interface';
import { UpdateEvent } from '../interfaces/update-event.interface';
import { EventFilter } from '../interfaces/event-filter.interface';

@Injectable()
export class EventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: EventFilter): Promise<Event[]> {
    const order =
      filters?.orderBy === 'upcoming'
        ? { date: 'asc' as const }
        : { createdAt: 'desc' as const };

    return (
      await this.prisma.event.findMany({
        where: {
          ...(filters?.type && { type: filters.type }),
          ...(filters?.source && { externalSource: filters.source }),
        },
        orderBy: order,
      })
    ).map((event: EventPrisma) => this.mapToEntity(event));
  }

  async findOne(id: string): Promise<Event | null> {
    const event: EventPrisma | null = await this.prisma.event.findUnique({
      where: { id },
    });
    if (!event) throw new NotFoundException(`Evento não encontrado`);
    return this.mapToEntity(event);
  }

  async create(createEvent: CreateEvent): Promise<Event> {
    const event: EventPrisma = await this.prisma.event.create({
      data: {
        ...createEvent,
      },
    });
    return this.mapToEntity(event);
  }

  async update(updateEvent: UpdateEvent): Promise<Event> {
    const event: EventPrisma = await this.prisma.event.update({
      where: { id: updateEvent.eventId },
      data: updateEvent,
    });
    return this.mapToEntity(event);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.event.delete({ where: { id: id } });
  }

  private mapToEntity(event: EventPrisma): Event {
    return new Event({
      id: event.id,
      organizerId: event.organizerId,
      externalApiId: event.externalApiId ?? undefined,
      externalSource: event.externalSource,
      title: event.title,
      description: event.description ?? undefined,
      imageUrl: event.imageUrl ?? undefined,
      location: event.location,
      date: event.date,
      type: event.type as Type,
      capacity: event.capacity,
      price: event.price.toNumber(),
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    });
  }
}
