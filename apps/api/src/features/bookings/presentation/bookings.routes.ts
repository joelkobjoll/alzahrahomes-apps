import { Hono } from 'hono';
import { desc, count, eq, and, gte, lte } from 'drizzle-orm';
import * as schema from '@alzahra/db/schema';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { z } from 'zod';

export interface BookingsDI {
  db: PostgresJsDatabase<typeof schema>;
}

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  propertyId: z.string().uuid().optional(),
  guestId: z.string().uuid().optional(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed', 'no_show']).optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
});

export function createBookingsRoutes(di: BookingsDI) {
  const app = new Hono();

  app.get('/', async (c) => {
    const query = querySchema.parse(c.req.query());
    const offset = (query.page - 1) * query.limit;

    const conditions = [];
    if (query.propertyId) {
      conditions.push(eq(schema.bookings.propertyId, query.propertyId));
    }
    if (query.guestId) {
      conditions.push(eq(schema.bookings.guestId, query.guestId));
    }
    if (query.status) {
      conditions.push(eq(schema.bookings.status, query.status));
    }
    if (query.fromDate) {
      conditions.push(gte(schema.bookings.checkIn, new Date(query.fromDate)));
    }
    if (query.toDate) {
      conditions.push(lte(schema.bookings.checkOut, new Date(query.toDate)));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const items = await di.db.query.bookings.findMany({
      where,
      limit: query.limit,
      offset,
      orderBy: [desc(schema.bookings.createdAt)],
    });

    const countResult = await di.db
      .select({ value: count() })
      .from(schema.bookings)
      .where(where ?? undefined);

    const total = Number(countResult[0]?.value ?? 0);

    return c.json({ data: { items, total, page: query.page, limit: query.limit }, error: null });
  });

  app.get('/:id', async (c) => {
    return c.json({ data: null, error: { status: 501, code: 'NOT_IMPLEMENTED', message: 'Not implemented' } }, 501);
  });

  return app;
}
