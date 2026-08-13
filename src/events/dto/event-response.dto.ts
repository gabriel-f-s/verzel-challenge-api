import { ExternalSource } from '../domain/enums/external-source.enum';
import { Type } from '../domain/enums/type.enum';

export class EventResponseDto {
  title: string;
  description?: string;
  imageUrl?: string;
  location: string;
  date: string;
  type?: Type;
  capacity: number;
  price: number;
  externalSource?: ExternalSource;

  constructor(partial: Partial<EventResponseDto>) {
    this.title = partial.title ?? '';
    this.description = partial.description ?? '';
    this.imageUrl = partial.imageUrl ?? '';
    this.location = partial.location ?? '';
    this.date = partial.date ?? '';
    this.type = partial.type ?? undefined;
    this.capacity = partial.capacity ?? 0;
    this.price = partial.price ?? 0;
    this.externalSource = partial.externalSource ?? undefined;
  }
}
