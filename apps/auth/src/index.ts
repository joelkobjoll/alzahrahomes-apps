import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { createDIContainer } from './infrastructure/di.js';
import { createAuthRoutes } from './presentation/auth.routes.js';
import { errorHandler } from './presentation/middleware/error-handler.js';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}

const di = createDIContainer(databaseUrl);
const authRoutes = createAuthRoutes(di);

const app = new Hono();

app.use(logger());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost:3000', 'http://localhost:4321'],
  credentials: true,
}));
app.use(errorHandler());

app.route('/', authRoutes);

app.get('/health', (c) => c.json({ status: 'ok' }));

const port = Number(process.env.PORT ?? 4001);

export default {
  port,
  fetch: app.fetch,
};
