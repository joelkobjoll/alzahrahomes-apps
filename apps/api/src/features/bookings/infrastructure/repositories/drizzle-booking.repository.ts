import { eq, and, gte, lte, count, sql } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@alzahra/db/schema';
import type { IBookingRepository } from '../../domain/repositories/booking-repository.interface.js';
import type { Booking } from '../../domain/entities/booking.js';

export class DrizzleBookingRepository implements IBookingRepository {
  constructor(private readonly db: PostgresJsDatabase<typeof schema>) {}

  async findById(id: string): Promise<Booking | null> {
    const row = await this.db.query.bookings.findFirst({
      where: eq(schema.bookings.id, id),
    });
    return row ? this.toDomain(row) : null;
  }

  async findMany(options: {
    limit: number;
    offset: number;
    propertyId?: string;
    guestId?: string;
    status?: string;
    fromDate?: Date;
    toDate?: Date;
  }): Promise<{ items: Booking[]; total: number }> {
    const conditions = [];
    if (options.propertyId) conditions.push(eq(schema.bookings.propertyId, options.propertyId));
    if (options.guestId) conditions.push(eq(schema.bookings.guestId, options.guestId));
    if (options.status) conditions.push(eq(schema.bookings.status, options.status as schema.BookingStatus));
    if (options.fromDate) conditions.push(gte(schema.bookings.checkIn, options.fromDate));
    if (options.toDate) conditions.push(lte(schema.bookings.checkOut, options.toDate));

    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const rows = await this.db.query.bookings.findMany({
      where,
      limit: options.limit,
      offset: options.offset,
      orderBy: (t) => [sql`${t.createdAt} DESC`],
    });
    const countResult = await this.db.select({ value: count() }).from(schema.bookings).where(where ?? sql`TRUE`);
    return { items: rows.map((r) => this.toDomain(r)), total: Number(countResult[0]?.value ?? 0) };
  }

  async create(input: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'cancelledAt' | 'cancellationReason'>): Promise<Booking> {
    const result = await this.db.insert(schema.bookings).values(input).returning();
    return this.toDomain(result[0]!);
  }

  async update(id: string, changes: Partial<Omit<Booking, 'id' | 'createdAt'>>): Promise<Booking | null> {
    const result = await this.db.update(schema.bookings).set({ ...changes, updatedAt: new Date() }).where(eq(schema.bookings.id, id)).returning();
    return result[0] ? this.toDomain(result[0]) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.delete(schema.bookings).where(eq(schema.bookings.id, id)).returning();
    return result.length > 0;
  }

  private toDomain(row: typeof schema.bookings.$inferSelect): Booking {
    return {
      id: row.id,
      propertyId: row.propertyId,
      guestId: row.guestId,
      checkIn: row.checkIn,
      checkOut: row.checkOut,
      status: row.status as Booking['status'],
      totalPrice: row.totalPrice,
      currency: row.currency,
      guestCount: row.guestCount,
      specialRequests: row.specialRequests,
      metadata: row.metadata as Record<string, unknown> | null,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      cancelledAt: row.cancelledAt,
      cancellationReason: row.cancellationReason,
    };
  }
}
