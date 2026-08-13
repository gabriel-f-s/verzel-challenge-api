import { Type } from '../domain/enums/type.enum';
import { ExternalSource } from '../domain/enums/external-source.enum';

export interface EventFilter {
  type: Type | undefined;
  source: ExternalSource | undefined;
}
