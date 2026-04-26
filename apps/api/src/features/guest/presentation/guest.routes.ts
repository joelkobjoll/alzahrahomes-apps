import { Hono, type Context } from 'hono';
import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import * as schema from '@alzahra/db/schema';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type { ValidateTokenUseCase } from '../../tokens/application/use-cases/validate-token.use-case.js';
import { TokenNotFoundError } from '../../tokens/domain/errors/token-not-found-error.js';
import { TokenExpiredError } from '../../tokens/domain/errors/token-expired-error.js';
import { TokenRevokedError } from '../../tokens/domain/errors/token-revoked-error.js';

export interface GuestDI {
  db: PostgresJsDatabase<typeof schema>;
  validateTokenUseCase: ValidateTokenUseCase;
}

const messageBodySchema = z.object({
  body: z.string().min(1),
});

const feedbackBodySchema = z.object({
  rating: z.number().int().min(1).max(5),
  cleanliness: z.number().int().min(1).max(5).optional().nullable(),
  communication: z.number().int().min(1).max(5).optional().nullable(),
  location: z.number().int().min(1).max(5).optional().nullable(),
  value: z.number().int().min(1).max(5).optional().nullable(),
  comment: z.string().optional().nullable(),
});

export function createGuestRoutes(di: GuestDI) {
  const app = new Hono();

  // Helper to get token from header and validate it
  async function validateGuestToken(c: Context) {
    const token = c.req.header('x-guest-token');
    if (!token) {
      return { error: { status: 401, code: 'MISSING_TOKEN', message: 'x-guest-token header is required' } as const };
    }

    try {
      const validToken = await di.validateTokenUseCase.execute({ token });
      return { token: validToken, plainToken: token, error: null };
    } catch (err) {
      if (err instanceof TokenNotFoundError || err instanceof TokenExpiredError || err instanceof TokenRevokedError) {
        return { error: { status: 401, code: 'INVALID_TOKEN', message: err.message } as const };
      }
      throw err;
    }
  }

  // POST /v1/guest/validate
  app.post('/validate', async (c) => {
    const body = await c.req.json().catch(() => ({})) as { token?: string };
    const headerToken = c.req.header('x-guest-token');
    const tokenToValidate = body.token ?? headerToken;

    if (!tokenToValidate) {
      return c.json({ data: null, error: { status: 400, code: 'MISSING_TOKEN', message: 'Token is required' } }, 400);
    }

    try {
      const token = await di.validateTokenUseCase.execute({ token: tokenToValidate });
      return c.json({ data: { valid: true, userId: token.userId }, error: null });
    } catch (err) {
      if (err instanceof TokenNotFoundError || err instanceof TokenExpiredError || err instanceof TokenRevokedError) {
        return c.json({ data: { valid: false }, error: { status: 401, code: 'INVALID_TOKEN', message: err.message } }, 401);
      }
      throw err;
    }
  });

  // GET /v1/guest/stay
  app.get('/stay', async (c) => {
    const result = await validateGuestToken(c);
    if (result.error) {
      return c.json({ data: null, error: result.error }, result.error.status);
    }

    // Find the most recent active booking for this user
    const booking = await di.db.query.bookings.findFirst({
      where: and(
        eq(schema.bookings.guestId, result.token.userId),
        eq(schema.bookings.status, 'confirmed'),
      ),
      orderBy: (bookings, { desc }) => [desc(bookings.checkIn)],
      with: {
        property: true,
      },
    });

    if (!booking) {
      return c.json({ data: null, error: { status: 404, code: 'NO_ACTIVE_STAY', message: 'No active stay found for this token' } }, 404);
    }
    if (!booking.property) {
      return c.json({ data: null, error: { status: 404, code: 'NO_ACTIVE_STAY', message: 'No active stay found for this token' } }, 404);
    }

    const propertyRow = booking.property as typeof schema.properties.$inferSelect;
    const property = {
      ...propertyRow,
      latitude: propertyRow.latitude?.toString() ?? null,
      longitude: propertyRow.longitude?.toString() ?? null,
      pricePerNight: propertyRow.pricePerNight?.toString() ?? null,
      bathrooms: propertyRow.bathrooms?.toString() ?? null,
    };

    return c.json({ data: { property, booking }, error: null });
  });

  // GET /v1/guest/recommendations
  app.get('/recommendations', async (c) => {
    const result = await validateGuestToken(c);
    if (result.error) {
      return c.json({ data: null, error: result.error }, result.error.status);
    }

    const recs = await di.db.query.recommendations.findMany({
      orderBy: (recommendations, { desc }) => [desc(recommendations.createdAt)],
      limit: 20,
    });

    return c.json({ data: { recommendations: recs }, error: null });
  });

  // GET /v1/guest/messages
  app.get('/messages', async (c) => {
    const result = await validateGuestToken(c);
    if (result.error) {
      return c.json({ data: null, error: result.error }, result.error.status);
    }

    const msgs = await di.db.query.messages.findMany({
      where: eq(schema.messages.senderId, result.token.userId),
      orderBy: (messages, { asc }) => [asc(messages.createdAt)],
      limit: 100,
    });

    const formatted = msgs.map((m) => ({
      id: m.id,
      sender: 'guest' as const,
      body: m.body,
      createdAt: m.createdAt.toISOString(),
    }));

    return c.json({ data: { messages: formatted }, error: null });
  });

  // POST /v1/guest/messages
  app.post('/messages', async (c) => {
    const result = await validateGuestToken(c);
    if (result.error) {
      return c.json({ data: null, error: result.error }, result.error.status);
    }

    const body = messageBodySchema.parse(await c.req.json());

    // Find a property owner to message
    const booking = await di.db.query.bookings.findFirst({
      where: eq(schema.bookings.guestId, result.token.userId),
      with: { property: true },
    });

    const recipientId = (booking?.property as typeof schema.properties.$inferSelect | null | undefined)?.ownerId ?? result.token.userId;

    const messageResult = await di.db.insert(schema.messages)
      .values({
        senderId: result.token.userId,
        recipientId,
        body: body.body,
        type: 'inquiry',
        propertyId: booking?.propertyId ?? null,
        bookingId: booking?.id ?? null,
      })
      .returning();
    const message = messageResult[0]!;

    return c.json({
      data: {
        message: {
          id: message.id,
          sender: 'guest' as const,
          body: message.body,
          createdAt: message.createdAt.toISOString(),
        },
      },
      error: null,
    }, 201);
  });

  // POST /v1/guest/feedback
  app.post('/feedback', async (c) => {
    const result = await validateGuestToken(c);
    if (result.error) {
      return c.json({ data: null, error: result.error }, result.error.status);
    }

    const body = feedbackBodySchema.parse(await c.req.json());

    const booking = await di.db.query.bookings.findFirst({
      where: eq(schema.bookings.guestId, result.token.userId),
      with: { property: true },
    });

    if (!booking || !booking.property) {
      return c.json({ data: null, error: { status: 404, code: 'NO_BOOKING', message: 'No booking found for feedback' } }, 404);
    }

    const [fb] = await di.db.insert(schema.feedback)
      .values({
        bookingId: booking.id,
        propertyId: booking.propertyId,
        userId: result.token.userId,
        rating: body.rating,
        cleanliness: body.cleanliness ?? null,
        communication: body.communication ?? null,
        location: body.location ?? null,
        value: body.value ?? null,
        comment: body.comment ?? null,
      })
      .returning();

    return c.json({ data: { feedback: fb }, error: null }, 201);
  });

  app.onError((err, c) => {
    if (err instanceof z.ZodError) {
      return c.json({
        data: null,
        error: {
          status: 400,
          code: 'VALIDATION_ERROR',
          message: 'Invalid request',
          details: err.issues.reduce((acc, issue) => {
            const path = issue.path.join('.');
            acc[path] = acc[path] ?? [];
            acc[path].push(issue.message);
            return acc;
          }, {} as Record<string, string[]>),
        },
      }, 400);
    }
    return c.json({
      data: null,
      error: { status: 500, code: 'INTERNAL_ERROR', message: err instanceof Error ? err.message : 'Unknown error' },
    }, 500);
  });

  return app;
}
