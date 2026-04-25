import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  jsonb,
  index,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users.js';
import { bookings } from './bookings.js';
import { properties } from './properties.js';
import { eventTypeEnum, eventStatusEnum } from './enums.js';

export const events = pgTable(
  'events',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    propertyId: uuid('property_id').references(() => properties.id, { onDelete: 'cascade' }),
    bookingId: uuid('booking_id').references(() => bookings.id, { onDelete: 'cascade' }),
    type: eventTypeEnum('type').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    startAt: timestamp('start_at', { withTimezone: true, mode: 'date' }).notNull(),
    endAt: timestamp('end_at', { withTimezone: true, mode: 'date' }),
    allDay: boolean('all_day').notNull().default(false),
    assigneeId: uuid('assignee_id').references(() => users.id, { onDelete: 'set null' }),
    status: eventStatusEnum('status').notNull().default('scheduled'),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    propertyIdx: index('events_property_id_idx').on(table.propertyId),
    bookingIdx: index('events_booking_id_idx').on(table.bookingId),
    assigneeIdx: index('events_assignee_id_idx').on(table.assigneeId),
    typeIdx: index('events_type_idx').on(table.type),
    statusIdx: index('events_status_idx').on(table.status),
    startAtIdx: index('events_start_at_idx').on(table.startAt),
    // Composite index for calendar view queries
    propertyDateIdx: index('events_property_date_idx').on(table.propertyId, table.startAt),
    // Partial index for upcoming events
    upcomingIdx: index('events_upcoming_idx')
      .on(table.startAt)
      .where(
        sql`${table.status} = 'scheduled' AND ${table.startAt} > NOW()`,
      ),
  }),
);

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
