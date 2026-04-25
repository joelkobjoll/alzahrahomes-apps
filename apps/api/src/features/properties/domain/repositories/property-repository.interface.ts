import type { Property, CreatePropertyInput, UpdatePropertyInput } from '../entities/property.js';

export interface IPropertyRepository {
  findById(id: string): Promise<Property | null>;
  findBySlug(slug: string): Promise<Property | null>;
  findMany(options: {
    limit: number;
    offset: number;
    city?: string;
    country?: string;
    category?: string;
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    minGuests?: number;
  }): Promise<{ items: Property[]; total: number }>;
  create(input: CreatePropertyInput): Promise<Property>;
  update(id: string, input: UpdatePropertyInput): Promise<Property | null>;
  delete(id: string): Promise<boolean>;
}
