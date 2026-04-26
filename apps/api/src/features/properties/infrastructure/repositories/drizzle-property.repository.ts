import { eq, and, gte, lte, sql, count } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@alzahra/db/schema';
import type { IPropertyRepository } from '../../domain/repositories/property-repository.interface.js';
import type { Property, CreatePropertyInput, UpdatePropertyInput } from '../../domain/entities/property.js';

export class DrizzlePropertyRepository implements IPropertyRepository {
  constructor(private readonly db: PostgresJsDatabase<typeof schema>) {}

  async findById(id: string): Promise<Property | null> {
    const row = await this.db.query.properties.findFirst({
      where: eq(schema.properties.id, id),
    });
    return row ? this.toDomain(row) : null;
  }

  async findBySlug(slug: string): Promise<Property | null> {
    const row = await this.db.query.properties.findFirst({
      where: eq(schema.properties.slug, slug),
    });
    return row ? this.toDomain(row) : null;
  }

  async findMany(options: {
    limit: number;
    offset: number;
    city?: string;
    country?: string;
    category?: string;
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    minGuests?: number;
  }): Promise<{ items: Property[]; total: number }> {
    const conditions = [];

    if (options.city) {
      conditions.push(eq(schema.properties.city, options.city));
    }
    if (options.country) {
      conditions.push(eq(schema.properties.country, options.country));
    }
    if (options.category) {
      conditions.push(eq(schema.properties.category, options.category as schema.PropertyCategory));
    }
    if (options.status) {
      conditions.push(eq(schema.properties.status, options.status as schema.PropertyStatus));
    } else {
      conditions.push(eq(schema.properties.status, 'published'));
    }
    if (options.minPrice != null) {
      conditions.push(gte(schema.properties.pricePerNight, String(options.minPrice)));
    }
    if (options.maxPrice != null) {
      conditions.push(lte(schema.properties.pricePerNight, String(options.maxPrice)));
    }
    if (options.minGuests != null) {
      conditions.push(gte(schema.properties.maxGuests, options.minGuests));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const rows = await this.db.query.properties.findMany({
      where,
      limit: options.limit,
      offset: options.offset,
      orderBy: (t) => [sql`${t.createdAt} DESC`],
    });

    const countResult = await this.db
      .select({ value: count() })
      .from(schema.properties)
      .where(where ?? sql`TRUE`);

    return {
      items: rows.map((r) => this.toDomain(r)),
      total: Number(countResult[0]?.value ?? 0),
    };
  }

  async create(input: CreatePropertyInput): Promise<Property> {
    const result = await this.db
      .insert(schema.properties)
      .values({
        name: input.name,
        slug: input.slug,
        description: input.description ?? null,
        category: input.category as schema.PropertyCategory,
        address: input.address ?? null,
        city: input.city ?? null,
        country: input.country ?? null,
        postalCode: input.postalCode ?? null,
        latitude: input.latitude != null ? String(input.latitude) : null,
        longitude: input.longitude != null ? String(input.longitude) : null,
        bedrooms: input.bedrooms ?? null,
        bathrooms: input.bathrooms != null ? String(input.bathrooms) : null,
        maxGuests: input.maxGuests ?? null,
        pricePerNight: input.pricePerNight != null ? String(input.pricePerNight) : null,
        currency: input.currency ?? 'EUR',
        amenities: input.amenities ?? null,
        images: input.images ?? null,
        ownerId: input.ownerId ?? null,
      })
      .returning();
    return this.toDomain(result[0]!);
  }

  async update(id: string, input: UpdatePropertyInput): Promise<Property | null> {
    const result = await this.db
      .update(schema.properties)
      .set({
        ...input,
        latitude: input.latitude != null ? String(input.latitude) : input.latitude,
        longitude: input.longitude != null ? String(input.longitude) : input.longitude,
        bathrooms: input.bathrooms != null ? String(input.bathrooms) : input.bathrooms,
        pricePerNight: input.pricePerNight != null ? String(input.pricePerNight) : input.pricePerNight,
        updatedAt: new Date(),
      })
      .where(eq(schema.properties.id, id))
      .returning();
    return result[0] ? this.toDomain(result[0]) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db
      .delete(schema.properties)
      .where(eq(schema.properties.id, id))
      .returning();
    return result.length > 0;
  }

  private toDomain(row: typeof schema.properties.$inferSelect): Property {
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      category: row.category as Property['category'],
      status: row.status as Property['status'],
      address: row.address,
      city: row.city,
      country: row.country,
      postalCode: row.postalCode,
      latitude: row.latitude,
      longitude: row.longitude,
      geom: row.geom,
      bedrooms: row.bedrooms,
      bathrooms: row.bathrooms,
      maxGuests: row.maxGuests,
      pricePerNight: row.pricePerNight,
      currency: row.currency,
      amenities: row.amenities,
      images: row.images,
      ownerId: row.ownerId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
