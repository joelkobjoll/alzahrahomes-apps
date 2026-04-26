import type { Context, Next } from 'hono';
import { DomainError } from '../../domain/errors/domain-error.js';

export function errorHandler() {
  return async (c: Context, next: Next) => {
    try {
      await next();
      return;
    } catch (err) {
      if (err instanceof DomainError) {
        c.status(err.statusCode as 200);
        return c.json({
          data: null,
          error: {
            status: err.statusCode,
            code: err.code,
            message: err.message,
          },
        });
      }

      console.error('Unhandled error:', err);
      c.status(500);
      return c.json({
        data: null,
        error: {
          status: 500,
          code: 'INTERNAL_ERROR',
          message: 'Internal server error',
        },
      });
    }
  };
}
