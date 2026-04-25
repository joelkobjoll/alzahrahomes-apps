import { faker } from '@faker-js/faker';
import type { Property, PropertyCategory, PropertyStatus } from '@alzahra/types';

export class PropertyFactory {
  static create(overrides?: Partial<Property>): Property {
    const now = new Date();
    return {
      id: faker.string.uuid(),
      name: faker.company.name(),
      slug: faker.helpers.slugify(faker.company.name()).toLowerCase() || faker.lorem.slug(),
      description: faker.lorem.paragraph(),
      category: faker.helpers.arrayElement<PropertyCategory>([
        'apartment',
        'villa',
        'house',
        'studio',
        'penthouse',
        'townhouse',
        'bungalow',
        'cottage',
        'other',
      ]),
      status: faker.helpers.arrayElement<PropertyStatus>(['draft', 'published', 'archived']),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      country: faker.location.country(),
      postalCode: faker.location.zipCode(),
      latitude: faker.location.latitude().toString(),
      longitude: faker.location.longitude().toString(),
      geom: null,
      bedrooms: faker.number.int({ min: 1, max: 5 }),
      bathrooms: faker.number.float({ min: 1, max: 3, fractionDigits: 1 }).toString(),
      maxGuests: faker.number.int({ min: 1, max: 10 }),
      pricePerNight: faker.commerce.price({ min: 50, max: 500, dec: 2 }),
      currency: 'EUR',
      amenities: faker.helpers.arrayElements(
        ['wifi', 'pool', 'gym', 'parking', 'ac', 'kitchen', 'tv', 'washer'],
        { min: 2, max: 5 }
      ),
      images: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () =>
        faker.image.urlPicsumPhotos()
      ),
      ownerId: faker.string.uuid(),
      createdAt: now,
      updatedAt: now,
      ...overrides,
    };
  }

  static withLocation(lat: number, lng: number, overrides?: Partial<Property>): Property {
    return this.create({
      latitude: lat.toString(),
      longitude: lng.toString(),
      ...overrides,
    });
  }

  static withPhotos(count: number, overrides?: Partial<Property>): Property {
    return this.create({
      images: Array.from({ length: count }, () => faker.image.urlPicsumPhotos()),
      ...overrides,
    });
  }
}
