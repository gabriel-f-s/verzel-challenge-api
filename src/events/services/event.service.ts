import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { EventRepository } from '../repositories/event.repository';
import { Event } from '../domain/entities/event.entity';
import { Type } from '../domain/enums/type.enum';
import { ExternalSource } from '../domain/enums/external-source.enum';

@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}

  async create(
    request: CreateEventDto,
    organizerId: string,
    externalApiId?: string,
    externalSource: ExternalSource = ExternalSource.CUSTOM,
  ) {
    return this.eventRepository.create({
      organizerId: organizerId,
      externalApiId: externalApiId,
      externalSource: externalSource,
      title: request.title,
      description: request.description,
      imageUrl: request.imageUrl,
      location: request.location,
      date: request.date,
      type: request.type as Type,
      capacity: request.capacity,
      price: request.price,
    });
  }

  async findAll(filters?: {
    type?: string;
    source?: string;
  }): Promise<Event[]> {
    let type: Type | undefined = undefined;
    let source: ExternalSource | undefined = undefined;
    if (filters?.type && Object.values(Type).includes(filters?.type as Type)) {
      type = filters.type as Type;
    }

    if (
      filters?.source &&
      Object.values(ExternalSource).includes(filters?.source as ExternalSource)
    ) {
      source = filters.source as ExternalSource;
    }

    return this.eventRepository.findAll({
      type,
      source,
    });
  }

  async findOne(id: string) {
    const event: Event | null = await this.eventRepository.findOne(id);
    if (!event) throw new NotFoundException('Evento não encontrado');
    return event;
  }

  async update(id: string, request: UpdateEventDto, organizerId: string) {
    const event = await this.findOne(id);
    if (event.organizerId !== organizerId) {
      throw new ForbiddenException('Apenas o criador pode editar este evento');
    }

    if (
      request.title == undefined ||
      request.location == undefined ||
      request.date == undefined ||
      request.capacity == undefined ||
      request.price == undefined
    ) {
      throw new BadRequestException('Campos inválidos');
    }

    return this.eventRepository.update({
      eventId: id,
      organizerId: organizerId,
      title: request.title,
      description: request.description,
      imageUrl: request.imageUrl,
      location: request.location,
      date: request.date,
      type: request.type as Type,
      capacity: request.capacity,
      price: request.price,
    });
  }

  async remove(id: string, organizerId: string) {
    const event = await this.findOne(id);
    if (event.organizerId !== organizerId) {
      throw new ForbiddenException('Apenas o criador pode deletar este evento');
    }
    return this.eventRepository.delete(id);
  }
}
