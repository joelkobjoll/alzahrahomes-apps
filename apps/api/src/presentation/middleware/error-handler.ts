import type { Context, Next } from 'hono';

export function errorHandler() {
  return async (c: Context, next: Next) => {
    try {
      await next();
    } catch (err) {
      if (err instanceof Error && 'statusCode' in err && 'code' in err) {
        const domainErr = err as Error & { statusCode: number; code: string };
        c.status(domainErr.statusCode as 200);
        return c.json({
          data: null,
          error: {
            status: domainErr.statusCode,
            code: domainErr.code,
            message: domainErr.message,
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
