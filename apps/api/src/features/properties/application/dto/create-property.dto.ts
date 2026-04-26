import type { PropertyCategory } from '../../domain/entities/property.js';

export interface CreatePropertyDTO {
  name: string;
  slug: string;
  description?: string | null | undefined;
  category: PropertyCategory;
  address?: string | null | undefined;
  city?: string | null | undefined;
  country?: string | null | undefined;
  postalCode?: string | null | undefined;
  latitude?: number | null | undefined;
  longitude?: number | null | undefined;
  bedrooms?: number | null | undefined;
  bathrooms?: number | null | undefined;
  maxGuests?: number | null | undefined;
  pricePerNight?: number | null | undefined;
  currency?: string | undefined;
  amenities?: string[] | null | undefined;
  images?: string[] | null | undefined;
  ownerId?: string | null | undefined;
}
