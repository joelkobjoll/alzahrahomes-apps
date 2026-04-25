import { Hono } from 'hono';
import type { HonoRequest } from 'hono';

/**
 * Create a test Hono app with the given routes mounted.
 *
 * @example
 * const app = createTestApp((app) => {
 *   app.get('/health', (c) => c.json({ ok: true }));
 *   return app;
 * });
 */
export function createTestApp<T extends Hono>(configure: (app: Hono) => T): T {
  const app = new Hono();
  return configure(app);
}

/**
 * Create a test Hono app with common middleware pre-configured
 * (request ID, CORS, error handling, etc.).
 */
export function createTestAppWithDefaults<T extends Hono>(configure: (app: Hono) => T): T {
  const app = new Hono();

  app.use('*', async (c, next) => {
    c.header('X-Request-Id', crypto.randomUUID());
    await next();
  });

  app.onError((err, c) => {
    return c.json(
      {
        status: 500,
        code: 'internal_error',
        message: err.message,
        requestId: c.res.headers.get('X-Request-Id') ?? undefined,
      },
      500
    );
  });

  return configure(app);
}

/**
 * Build an Authorization header value for a bearer token.
 */
export function bearerToken(token: string): string {
  return `Bearer ${token}`;
}

/**
 * Build cookie header string from a record of key-value pairs.
 */
export function cookieHeader(cookies: Record<string, string>): string {
  return Object.entries(cookies)
    .map(([k, v]) => `${k}=${v}`)
    .join('; ');
}

/**
 * Wait for a promise to resolve with a timeout.
 */
export function waitFor<T>(
  predicate: () => T | Promise<T>,
  options?: { timeout?: number; interval?: number }
): Promise<T> {
  const { timeout = 5000, interval = 50 } = options ?? {};
  const start = Date.now();

  return new Promise((resolve, reject) => {
    const check = async () => {
      try {
        const result = await predicate();
        if (result) {
          resolve(result);
          return;
        }
      } catch {
        // ignore and retry
      }

      if (Date.now() - start > timeout) {
        reject(new Error(`waitFor timed out after ${timeout}ms`));
        return;
      }

      setTimeout(check, interval);
    };

    check();
  });
}
