import type { PropertyCategory, PropertyStatus } from '@alzahra/validators';

export interface UpdatePropertyDTO {
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
