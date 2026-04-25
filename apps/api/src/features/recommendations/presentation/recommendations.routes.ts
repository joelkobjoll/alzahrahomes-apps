import { Hono } from 'hono';

export function createRecommendationsRoutes() {
  const app = new Hono();

  app.get('/', async (c) => {
    return c.json({ data: { items: [], total: 0, page: 1, limit: 20 }, error: null });
  });

  app.get('/:id', async (c) => {
    return c.json({ data: null, error: { status: 501, code: 'NOT_IMPLEMENTED', message: 'Not implemented' } }, 501);
  });

  return app;
}
