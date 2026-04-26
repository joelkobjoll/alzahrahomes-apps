import { PropertyFactory } from '../factories/property-factory.js';
import { UserFactory } from '../factories/user-factory.js';
import { TokenFactory } from '../factories/token-factory.js';
import { BookingFactory } from '../factories/booking-factory.js';
import { RecommendationFactory } from '../factories/recommendation-factory.js';
import type { TestDatabase } from './test-database.js';

export interface SeedData {
  users: ReturnType<typeof UserFactory.create>[];
  properties: ReturnType<typeof PropertyFactory.create>[];
  tokens: ReturnType<typeof TokenFactory.create>[];
  bookings: ReturnType<typeof BookingFactory.create>[];
  recommendations: ReturnType<typeof RecommendationFactory.create>[];
}

/**
 * Seed the test database with a standard set of fixtures.
 */
export async function seedTestDatabase(db: TestDatabase['db']): Promise<SeedData> {
  const admin = UserFactory.admin({ email: 'admin@alzahra.test' });
  const staff = UserFactory.staff({ email: 'staff@alzahra.test' });
  const owner = UserFactory.propertyManager({ email: 'owner@alzahra.test' });
  const guest = UserFactory.guest({ email: 'guest@alzahra.test' });
  const users = [admin, staff, owner, guest];

  const properties = [
    PropertyFactory.create({ ownerId: owner.id, status: 'published' }),
    PropertyFactory.create({ ownerId: owner.id, status: 'published' }),
    PropertyFactory.create({ ownerId: owner.id, status: 'draft' }),
  ];

  const tokens = [
    TokenFactory.active({ userId: admin.id, type: 'api' }),
    TokenFactory.expired({ userId: staff.id, type: 'refresh' }),
    TokenFactory.revoked({ userId: guest.id, type: 'api' }),
  ];

  const property0 = properties[0]!;
  const property1 = properties[1]!;
  const bookings = [
    BookingFactory.create(property0.id, undefined, { guestId: guest.id, status: 'confirmed' }),
    BookingFactory.create(property1.id, undefined, { guestId: guest.id, status: 'pending' }),
  ];

  const recommendations = [
    RecommendationFactory.create(),
    RecommendationFactory.withCategory('trending'),
    RecommendationFactory.withCategory('seasonal'),
  ];

  // Insert using Drizzle (cast to insertable shapes)
  await db.insert(schema.users).values(users as unknown as schema.NewUser);
  await db.insert(schema.properties).values(properties as unknown as schema.NewProperty);
  await db.insert(schema.tokens).values(tokens as unknown as schema.NewToken);
  await db.insert(schema.bookings).values(bookings as unknown as schema.NewBooking);
  await db.insert(schema.recommendations).values(recommendations as unknown as schema.NewRecommendation);

  return { users, properties, tokens, bookings, recommendations };
}

import * as schema from '@alzahra/db/schema';
