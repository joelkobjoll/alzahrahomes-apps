import type { Context, Next } from 'hono';
import { ZodError, type ZodSchema } from 'zod';

export function validateRequest(schema: ZodSchema) {
  return async (c: Context, next: Next) => {
    const body = await c.req.json().catch(() => ({}));
    const result = schema.safeParse(body);

    if (!result.success) {
      const issues = result.error instanceof ZodError ? result.error.issues : [];
      c.status(400);
      return c.json({
        data: null,
        error: {
          status: 400,
          code: 'VALIDATION_ERROR',
          message: 'Invalid request body',
          details: issues.reduce(
            (acc, issue) => {
              const path = issue.path.join('.');
              acc[path] = acc[path] ?? [];
              acc[path].push(issue.message);
              return acc;
            },
            {} as Record<string, string[]>,
          ),
        },
      });
    }

    c.set('validatedBody', result.data);
    await next();
  };
}
