import { Hono } from 'hono';
import { desc, count, eq, and, isNull } from 'drizzle-orm';
import * as schema from '@alzahra/db/schema';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { z } from 'zod';

export interface MessagesDI {
  db: PostgresJsDatabase<typeof schema>;
}

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  bookingId: z.string().uuid().optional(),
  propertyId: z.string().uuid().optional(),
  type: z.enum(['inquiry', 'booking', 'support', 'notification', 'system']).optional(),
  unreadOnly: z.coerce.boolean().optional(),
});

export function createMessagesRoutes(di: MessagesDI) {
  const app = new Hono();

  app.get('/', async (c) => {
    const query = querySchema.parse(c.req.query());
    const offset = (query.page - 1) * query.limit;

    const conditions = [];
    if (query.bookingId) {
      conditions.push(eq(schema.messages.bookingId, query.bookingId));
    }
    if (query.propertyId) {
      conditions.push(eq(schema.messages.propertyId, query.propertyId));
    }
    if (query.type) {
      conditions.push(eq(schema.messages.type, query.type));
    }
    if (query.unreadOnly) {
      conditions.push(isNull(schema.messages.readAt));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const items = await di.db.query.messages.findMany({
      where,
      limit: query.limit,
      offset,
      orderBy: [desc(schema.messages.createdAt)],
    });

    const countResult = await di.db
      .select({ value: count() })
      .from(schema.messages)
      .where(where ?? undefined);

    const total = Number(countResult[0]?.value ?? 0);

    return c.json({ data: { items, total, page: query.page, limit: query.limit }, error: null });
  });

  return app;
}
