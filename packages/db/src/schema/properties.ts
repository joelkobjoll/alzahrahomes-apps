import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
  jsonb,
  index,
  geometry,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users.js';
import { propertyStatusEnum, propertyCategoryEnum } from './enums.js';

export const properties = pgTable(
  'properties',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    description: text('description'),
    category: propertyCategoryEnum('category').notNull().default('other'),
    status: propertyStatusEnum('status').notNull().default('draft'),
    address: varchar('address', { length: 500 }),
    city: varchar('city', { length: 100 }),
    country: varchar('country', { length: 100 }),
    postalCode: varchar('postal_code', { length: 20 }),
    latitude: decimal('latitude', { precision: 10, scale: 8 }),
    longitude: decimal('longitude', { precision: 11, scale: 8 }),
    geom: geometry('geom', { type: 'point', srid: 4326 }),
    bedrooms: integer('bedrooms'),
    bathrooms: decimal('bathrooms', { precision: 3, scale: 1 }),
    maxGuests: integer('max_guests'),
    pricePerNight: decimal('price_per_night', { precision: 10, scale: 2 }),
    currency: varchar('currency', { length: 3 }).notNull().default('EUR'),
    amenities: jsonb('amenities').$type<string[]>(),
    images: jsonb('images').$type<string[]>(),
    ownerId: uuid('owner_id').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    slugIdx: index('properties_slug_idx').on(table.slug),
    statusIdx: index('properties_status_idx').on(table.status),
    categoryIdx: index('properties_category_idx').on(table.category),
    cityIdx: index('properties_city_idx').on(table.city),
    countryIdx: index('properties_country_idx').on(table.country),
    priceIdx: index('properties_price_idx').on(table.pricePerNight),
    ownerIdx: index('properties_owner_id_idx').on(table.ownerId),
    // PostGIS GiST index for spatial queries
    geomIdx: index('properties_geom_idx').using('gist', table.geom),
    // Composite index for search
    locationCategoryIdx: index('properties_location_category_idx').on(
      table.city,
      table.country,
      table.category,
    ),
    // Partial index for published properties
    publishedIdx: index('properties_published_idx')
      .on(table.status)
      .where(sql`${table.status} = 'published'`),
  }),
);

export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
