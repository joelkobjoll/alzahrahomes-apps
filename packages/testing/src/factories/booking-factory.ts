import { faker } from '@faker-js/faker';
import type { Booking, BookingStatus } from '@alzahra/types';

export interface BookingDates {
  checkIn: Date;
  checkOut: Date;
}

export class BookingFactory {
  static create(
    propertyId?: string,
    dates?: BookingDates,
    overrides?: Partial<Booking>
  ): Booking {
    const now = new Date();
    const checkIn = dates?.checkIn ?? faker.date.future({ years: 1 });
    const checkOut = dates?.checkOut ?? new Date(checkIn.getTime() + faker.number.int({ min: 1, max: 14 }) * 24 * 60 * 60 * 1000);

    return {
      id: faker.string.uuid(),
      propertyId: propertyId ?? faker.string.uuid(),
      guestId: faker.string.uuid(),
      checkIn,
      checkOut,
      status: faker.helpers.arrayElement<BookingStatus>([
        'pending',
        'confirmed',
        'cancelled',
        'completed',
        'no_show',
      ]),
      totalPrice: faker.commerce.price({ min: 100, max: 5000, dec: 2 }),
      currency: 'EUR',
      guestCount: faker.number.int({ min: 1, max: 8 }),
      specialRequests: faker.helpers.maybe(() => faker.lorem.sentence()) ?? null,
      metadata: null,
      createdAt: now,
      updatedAt: now,
      cancelledAt: null,
      cancellationReason: null,
      ...overrides,
    };
  }
}
