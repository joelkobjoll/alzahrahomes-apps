import {
  pgTable,
  uuid,
  integer,
  text,
  boolean,
  timestamp,
  index,
  check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users.js';
import { bookings } from './bookings.js';
import { properties } from './properties.js';

export const feedback = pgTable(
  'feedback',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    bookingId: uuid('booking_id')
      .notNull()
      .references(() => bookings.id, { onDelete: 'cascade' }),
    propertyId: uuid('property_id')
      .notNull()
      .references(() => properties.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    rating: integer('rating').notNull(),
    cleanliness: integer('cleanliness'),
    communication: integer('communication'),
    location: integer('location'),
    value: integer('value'),
    comment: text('comment'),
    isPublic: boolean('is_public').notNull().default(false),
    response: text('response'),
    respondedAt: timestamp('responded_at', { withTimezone: true, mode: 'date' }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    bookingIdx: index('feedback_booking_id_idx').on(table.bookingId),
    propertyIdx: index('feedback_property_id_idx').on(table.propertyId),
    userIdx: index('feedback_user_id_idx').on(table.userId),
    ratingIdx: index('feedback_rating_idx').on(table.rating),
    isPublicIdx: index('feedback_is_public_idx').on(table.isPublic),
    // Partial index for public reviews
    publicReviewsIdx: index('feedback_public_reviews_idx')
      .on(table.propertyId, table.rating)
      .where(sql`${table.isPublic} = true`),
    // Check constraints
    ratingCheck: check('feedback_rating_check', sql`${table.rating} BETWEEN 1 AND 5`),
  }),
);

export type Feedback = typeof feedback.$inferSelect;
export type NewFeedback = typeof feedback.$inferInsert;
