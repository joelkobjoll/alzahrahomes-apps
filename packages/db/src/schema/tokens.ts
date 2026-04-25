import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  jsonb,
  index,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users.js';
import { tokenTypeEnum } from './enums.js';

export const tokens = pgTable(
  'tokens',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: tokenTypeEnum('type').notNull(),
    tokenHash: varchar('token_hash', { length: 255 }).notNull().unique(),
    expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }),
    lastUsedAt: timestamp('last_used_at', { withTimezone: true, mode: 'date' }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
    revokedAt: timestamp('revoked_at', { withTimezone: true, mode: 'date' }),
    metadata: jsonb('metadata'),
  },
  (table) => ({
    userIdIdx: index('tokens_user_id_idx').on(table.userId),
    typeIdx: index('tokens_type_idx').on(table.type),
    tokenHashIdx: index('tokens_hash_idx').on(table.tokenHash),
    expiresAtIdx: index('tokens_expires_at_idx').on(table.expiresAt),
    // Partial index for active (non-revoked) tokens
    activeIdx: index('tokens_active_idx')
      .on(table.tokenHash)
      .where(sql`${table.revokedAt} IS NULL`),
  }),
);

export type Token = typeof tokens.$inferSelect;
export type NewToken = typeof tokens.$inferInsert;
