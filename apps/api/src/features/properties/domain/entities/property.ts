export type PropertyCategory = 'apartment' | 'villa' | 'house' | 'studio' | 'penthouse' | 'townhouse' | 'bungalow' | 'cottage' | 'other';
export type PropertyStatus = 'draft' | 'published' | 'archived';

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
  latitude: number | null;
  longitude: number | null;
  geom: unknown | null;
  bedrooms: number | null;
  bathrooms: number | null;
  maxGuests: number | null;
  pricePerNight: number | null;
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
  description?: string | null;
  category: PropertyCategory;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  maxGuests?: number | null;
  pricePerNight?: number | null;
  currency?: string;
  amenities?: string[] | null;
  images?: string[] | null;
  ownerId?: string | null;
}

export interface UpdatePropertyInput {
  name?: string;
  slug?: string;
  description?: string | null;
  category?: PropertyCategory;
  status?: PropertyStatus;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  maxGuests?: number | null;
  pricePerNight?: number | null;
  currency?: string;
  amenities?: string[] | null;
  images?: string[] | null;
  ownerId?: string | null;
}
