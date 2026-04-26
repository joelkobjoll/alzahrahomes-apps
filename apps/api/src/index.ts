import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { createDIContainer } from './infrastructure/di.js';
import { createPropertiesRoutes } from './features/properties/presentation/properties.routes.js';
import { createTokensRoutes } from './features/tokens/presentation/tokens.routes.js';
import { createRecommendationsRoutes } from './features/recommendations/presentation/recommendations.routes.js';
import { createBookingsRoutes } from './features/bookings/presentation/bookings.routes.js';
import { createGuestRoutes } from './features/guest/presentation/guest.routes.js';
import { createMessagesRoutes } from './features/messages/presentation/messages.routes.js';
import { errorHandler } from './presentation/middleware/error-handler.js';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}

const di = createDIContainer(databaseUrl);

const app = new Hono();

app.use(logger());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost:3000', 'http://localhost:4321'],
    credentials: true,
  }),
);
app.use(errorHandler());

app.route('/properties', createPropertiesRoutes(di));
app.route('/tokens', createTokensRoutes(di));
app.route('/recommendations', createRecommendationsRoutes());
app.route('/bookings', createBookingsRoutes(di));
app.route('/v1/guest', createGuestRoutes(di));
app.route('/messages', createMessagesRoutes(di));

app.get('/health', (c) => c.json({ status: 'ok' }));

const port = Number(process.env.PORT ?? 4000);

export default {
  port,
  fetch: app.fetch,
};
