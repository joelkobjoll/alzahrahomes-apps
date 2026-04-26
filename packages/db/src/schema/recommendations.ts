import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  decimal,
  timestamp,
  jsonb,
  index,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { properties } from './properties.js';
import { recommendationTypeEnum } from './enums.js';

export const recommendations = pgTable(
  'recommendations',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    type: recommendationTypeEnum('type').notNull().default('manual'),
    filters: jsonb('filters'),
    score: decimal('score', { precision: 3, scale: 2 }),
    validFrom: timestamp('valid_from', { withTimezone: true, mode: 'date' }),
    validUntil: timestamp('valid_until', { withTimezone: true, mode: 'date' }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    typeIdx: index('recommendations_type_idx').on(table.type),
    scoreIdx: index('recommendations_score_idx').on(table.score),
    validFromIdx: index('recommendations_valid_from_idx').on(table.validFrom),
    validUntilIdx: index('recommendations_valid_until_idx').on(table.validUntil),
  }),
);

export const propertyRecs = pgTable(
  'property_recs',
  {
    propertyId: uuid('property_id')
      .notNull()
      .references(() => properties.id, { onDelete: 'cascade' }),
    recommendationId: uuid('recommendation_id')
      .notNull()
      .references(() => recommendations.id, { onDelete: 'cascade' }),
    rank: integer('rank').notNull().default(0),
    reason: text('reason'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.propertyId, table.recommendationId] }),
    recommendationIdx: index('property_recs_recommendation_id_idx').on(table.recommendationId),
    rankIdx: index('property_recs_rank_idx').on(table.rank),
  }),
);

export type Recommendation = typeof recommendations.$inferSelect;
export type NewRecommendation = typeof recommendations.$inferInsert;
export type PropertyRec = typeof propertyRecs.$inferSelect;
export type NewPropertyRec = typeof propertyRecs.$inferInsert;
