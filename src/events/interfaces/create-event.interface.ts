import { Type } from '../domain/enums/type.enum';
import { ExternalSource } from '../domain/enums/external-source.enum';

export interface CreateEvent {
  organizerId: string;
  externalApiId?: string;
  externalSource?: ExternalSource;
  title: string;
  description?: string;
  imageUrl?: string;
  location: string;
  date: string;
  type?: Type;
  capacity: number;
  price: number;
}
