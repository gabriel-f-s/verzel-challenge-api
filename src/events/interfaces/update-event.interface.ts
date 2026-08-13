import { Type } from '../domain/enums/type.enum';

export interface UpdateEvent {
  eventId: string;
  organizerId: string;
  title: string;
  description?: string;
  imageUrl?: string;
  location: string;
  date: string;
  type?: Type;
  capacity: number;
  price: number;
}
