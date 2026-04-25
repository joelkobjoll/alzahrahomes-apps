import {
  pgTable,
  uuid,
  date,
  decimal,
  integer,
  varchar,
  text,
  jsonb,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users.js';
import { properties } from './properties.js';
import { bookingStatusEnum } from './enums.js';

export const bookings = pgTable(
  'bookings',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    propertyId: uuid('property_id')
      .notNull()
      .references(() => properties.id, { onDelete: 'restrict' }),
    guestId: uuid('guest_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    checkIn: date('check_in', { mode: 'date' }).notNull(),
    checkOut: date('check_out', { mode: 'date' }).notNull(),
    status: bookingStatusEnum('status').notNull().default('pending'),
    totalPrice: decimal('total_price', { precision: 10, scale: 2 }),
    currency: varchar('currency', { length: 3 }).notNull().default('EUR'),
    guestCount: integer('guest_count').notNull().default(1),
    specialRequests: text('special_requests'),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
    cancelledAt: timestamp('cancelled_at', { withTimezone: true, mode: 'date' }),
    cancellationReason: text('cancellation_reason'),
  },
  (table) => ({
    propertyIdIdx: index('bookings_property_id_idx').on(table.propertyId),
    guestIdIdx: index('bookings_guest_id_idx').on(table.guestId),
    statusIdx: index('bookings_status_idx').on(table.status),
    checkInIdx: index('bookings_check_in_idx').on(table.checkIn),
    // Composite index for availability queries
    propertyDatesIdx: index('bookings_property_dates_idx').on(
      table.propertyId,
      table.checkIn,
      table.checkOut,
    ),
    // Partial index for active bookings
    activeIdx: index('bookings_active_idx')
      .on(table.propertyId, table.checkIn)
      .where(
        sql`${table.status} IN ('pending', 'confirmed')`,
      ),
  }),
);

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
