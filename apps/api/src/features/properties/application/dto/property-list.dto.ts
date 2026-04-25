import type { Property } from '../../domain/entities/property.js';

export interface PropertyListDTO {
  items: Property[];
  total: number;
  page: number;
  limit: number;
}
