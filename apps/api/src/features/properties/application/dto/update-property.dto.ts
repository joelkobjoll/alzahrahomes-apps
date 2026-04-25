import type { PropertyCategory, PropertyStatus } from '@alzahra/validators';

export interface UpdatePropertyDTO {
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
