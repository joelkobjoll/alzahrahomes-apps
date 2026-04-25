import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users.js';
import { bookings } from './bookings.js';
import { properties } from './properties.js';
import { messageTypeEnum } from './enums.js';

export const messages = pgTable(
  'messages',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    bookingId: uuid('booking_id').references(() => bookings.id, { onDelete: 'set null' }),
    propertyId: uuid('property_id').references(() => properties.id, { onDelete: 'set null' }),
    senderId: uuid('sender_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    recipientId: uuid('recipient_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    subject: varchar('subject', { length: 255 }),
    body: text('body').notNull(),
    type: messageTypeEnum('type').notNull().default('inquiry'),
    readAt: timestamp('read_at', { withTimezone: true, mode: 'date' }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    senderIdx: index('messages_sender_id_idx').on(table.senderId),
    recipientIdx: index('messages_recipient_id_idx').on(table.recipientId),
    bookingIdx: index('messages_booking_id_idx').on(table.bookingId),
    propertyIdx: index('messages_property_id_idx').on(table.propertyId),
    typeIdx: index('messages_type_idx').on(table.type),
    createdAtIdx: index('messages_created_at_idx').on(table.createdAt),
    // Partial index for unread messages
    unreadIdx: index('messages_unread_idx')
      .on(table.recipientId)
      .where(sql`${table.readAt} IS NULL`),
  }),
);

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
