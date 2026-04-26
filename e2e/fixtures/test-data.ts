import { faker } from '@faker-js/faker';
import type { Property, User } from '@alzahra/types';

export const TEST_USER_PASSWORD = 'Password123!';

export interface TestUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: User['role'];
  avatarUrl: string | null;
  emailVerified: boolean;
}

export function createStaffUser(overrides?: Partial<TestUser>): TestUser {
  return {
    email: `e2e-staff-${faker.string.alphanumeric(8)}@alzahra.test`,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    phone: faker.phone.number(),
    role: 'staff',
    avatarUrl: null,
    emailVerified: true,
    password: TEST_USER_PASSWORD,
    ...overrides,
  };
}

export function createAdminUser(overrides?: Partial<TestUser>): TestUser {
  return {
    email: `e2e-admin-${faker.string.alphanumeric(8)}@alzahra.test`,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    phone: faker.phone.number(),
    role: 'admin',
    avatarUrl: null,
    emailVerified: true,
    password: TEST_USER_PASSWORD,
    ...overrides,
  };
}

export interface TestPropertyInput {
  name: string;
  slug: string;
  description?: string;
  category: Property['category'];
  status: Property['status'];
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  latitude?: string;
  longitude?: string;
  bedrooms?: number;
  bathrooms?: string;
  maxGuests?: number;
  pricePerNight?: string;
  currency: string;
  amenities?: string[];
  images?: string[];
  ownerId?: string;
}

export function createPropertyInput(overrides?: Partial<TestPropertyInput>): TestPropertyInput {
  return {
    name: faker.company.name(),
    slug: `${faker.lorem.slug()}-${faker.string.alphanumeric(4)}`,
    description: faker.lorem.paragraph(),
    category: faker.helpers.arrayElement(['apartment', 'villa', 'house', 'studio', 'penthouse'] as const),
    status: 'published',
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    country: faker.location.country(),
    postalCode: faker.location.zipCode(),
    latitude: faker.location.latitude().toString(),
    longitude: faker.location.longitude().toString(),
    bedrooms: faker.number.int({ min: 1, max: 5 }),
    bathrooms: faker.number.float({ min: 1, max: 3, fractionDigits: 1 }).toString(),
    maxGuests: faker.number.int({ min: 1, max: 10 }),
    pricePerNight: faker.commerce.price({ min: 50, max: 500, dec: 2 }),
    currency: 'EUR',
    amenities: ['wifi', 'kitchen', 'ac'],
    images: [faker.image.urlPicsumPhotos()],
    ...overrides,
  };
}
