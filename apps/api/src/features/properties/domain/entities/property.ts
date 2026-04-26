import type { PropertyCategory, PropertyStatus } from '@alzahra/validators';

export interface Property {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: PropertyCategory;
  status: PropertyStatus;
  address: string | null;
  city: string | null;
  country: string | null;
  postalCode: string | null;
  latitude: string | null;
  longitude: string | null;
  geom: unknown | null;
  bedrooms: number | null;
  bathrooms: string | null;
  maxGuests: number | null;
  pricePerNight: string | null;
  currency: string;
  amenities: string[] | null;
  images: string[] | null;
  ownerId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePropertyInput {
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

export interface UpdatePropertyInput {
  name?: string | undefined;
  slug?: string | undefined;
  description?: string | null | undefined;
  category?: PropertyCategory | undefined;
  status?: PropertyStatus | undefined;
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
