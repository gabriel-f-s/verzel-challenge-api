import { Type } from '../enums/type.enum';

export class Event {
  id: string;
  organizerId: string;
  externalApiId: string;
  externalSource: string;
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  date: Date;
  type: Type;
  capacity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Event>) {
    this.id = partial.id ?? '';
    this.organizerId = partial.organizerId ?? '';
    this.externalApiId = partial.externalApiId ?? '';
    this.externalSource = partial.externalSource ?? '';
    this.title = partial.title ?? '';
    this.description = partial.description ?? '';
    this.imageUrl = partial.imageUrl ?? '';
    this.location = partial.location ?? '';
    this.date = partial.date ?? new Date();
    this.type = partial.type ?? Type.GENERAL;
    this.capacity = partial.capacity ?? 0;
    this.price = partial.price ?? 0;
    this.createdAt = partial.createdAt ?? new Date();
    this.updatedAt = partial.updatedAt ?? new Date();
  }
}
