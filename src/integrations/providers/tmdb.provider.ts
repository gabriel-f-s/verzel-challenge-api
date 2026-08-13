import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import {
  IExternalEventProvider,
  ExternalEventData,
} from '../domain/interfaces/external-provider.interface';
import {
  TmdbSearchResponse,
  TmdbMovie,
} from '../domain/interfaces/tmdb-response.interface';
import { ExternalSource } from '../../events/domain/enums/external-source.enum';
import { Type } from '../../events/domain/enums/type.enum';

@Injectable()
export class TmdbProvider implements IExternalEventProvider {
  private readonly logger = new Logger(TmdbProvider.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.themoviedb.org/3';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('TMDB_API_KEY') || '';
  }

  async search(query: string): Promise<ExternalEventData[]> {
    try {
      const url = `${this.baseUrl}/search/movie`;
      const response: AxiosResponse<TmdbSearchResponse> = await firstValueFrom(
        this.httpService.get<TmdbSearchResponse>(url, {
          params: {
            api_key: this.apiKey,
            query: query,
            language: 'pt-BR',
          },
        }),
      );

      const movies: TmdbMovie[] = response.data.results || [];
      return movies.map((movie: TmdbMovie) => this.mapToDomain(movie));
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      this.logger.error(`Erro ao buscar no TMDB: ${errorMessage}`);
      return [];
    }
  }

  async getById(id: string): Promise<ExternalEventData | null> {
    try {
      const url = `${this.baseUrl}/movie/${id}`;
      const response: AxiosResponse<TmdbMovie> = await firstValueFrom(
        this.httpService.get<TmdbMovie>(url, {
          params: {
            api_key: this.apiKey,
            language: 'pt-BR',
          },
        }),
      );

      if (!response.data) return null;
      return this.mapToDomain(response.data);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      this.logger.error(
        `Erro ao buscar filme no TMDB por ID ${id}: ${errorMessage}`,
      );
      return null;
    }
  }

  private mapToDomain(tmdbMovie: TmdbMovie): ExternalEventData {
    const imageUrl = tmdbMovie.poster_path
      ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
      : 'https://via.placeholder.com/500x750?text=Sem+Imagem';

    return {
      externalId: tmdbMovie.id.toString(),
      source: ExternalSource.TMDB,
      title:
        (tmdbMovie.title || tmdbMovie.original_title) ?? 'Título indisponível',
      description: tmdbMovie.overview || 'Descrição indisponível.',
      imageUrl: imageUrl,
      date: tmdbMovie.release_date
        ? new Date(tmdbMovie.release_date).toISOString()
        : new Date().toISOString(),
      location: 'Cinema (Local a definir)',
      type: Type.SEATED,
      capacity: 150,
      price: 45.0,
    };
  }
}
