import { ExternalSource } from '../../../events/domain/enums/external-source.enum';
import { Type } from '../../../events/domain/enums/type.enum';

export interface ExternalEventData {
  externalId: string;
  source: ExternalSource;
  title: string;
  description?: string;
  imageUrl?: string;
  date: string;
  location: string;
  type: Type;
  capacity: number;
  price: number;
}

export interface IExternalEventProvider {
  search(query: string): Promise<ExternalEventData[]>;
  getById(id: string): Promise<ExternalEventData | null>;
}
