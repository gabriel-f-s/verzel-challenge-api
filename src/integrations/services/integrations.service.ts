import { Injectable, BadRequestException } from '@nestjs/common';
import { TmdbProvider } from '../providers/tmdb.provider';
import { EventService } from '../../events/services/event.service';
import { ExternalSource } from '../../events/domain/enums/external-source.enum';
import { ExternalEventData } from '../domain/interfaces/external-provider.interface';

@Injectable()
export class IntegrationsService {
  constructor(
    private readonly tmdbProvider: TmdbProvider,
    private readonly eventService: EventService,
  ) {}

  async search(query: string, source: string) {
    if ((source as ExternalSource) === ExternalSource.TMDB) {
      return this.tmdbProvider.search(query);
    }
    throw new BadRequestException(
      'Fonte externa não suportada ou não implementada (Utilize TMDB).',
    );
  }

  async importEvent(source: string, externalId: string, organizerId: string) {
    let externalEvent: ExternalEventData | null = null;

    if ((source as ExternalSource) === ExternalSource.TMDB) {
      externalEvent = await this.tmdbProvider.getById(externalId);
    } else {
      throw new BadRequestException(
        'Fonte externa não suportada (Utilize TMDB).',
      );
    }

    if (!externalEvent) {
      throw new BadRequestException('Evento não encontrado na fonte externa.');
    }

    return this.eventService.create(
      {
        title: externalEvent.title,
        description: externalEvent.description,
        imageUrl: externalEvent.imageUrl,
        location: externalEvent.location,
        date: externalEvent.date,
        type: externalEvent.type,
        capacity: externalEvent.capacity,
        price: externalEvent.price,
      },
      organizerId,
      externalEvent.externalId,
      externalEvent.source,
    );
  }
}
