import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index.js';

export type DatabaseClient = ReturnType<typeof createDatabaseClient>;

export interface ClientOptions {
  /** Database connection URL */
  url?: string;
  /** Maximum number of connections in the pool */
  maxConnections?: number;
  /** Enable query logging in development */
  logQueries?: boolean;
}

/**
 * Create a database client with Drizzle ORM.
 *
 * Uses postgres.js for connection pooling. In serverless environments,
 * consider passing `maxConnections: 1` or using a connection string
 * with pooling parameters.
 */
export function createDatabaseClient(options: ClientOptions = {}) {
  const url = options.url ?? process.env.DATABASE_URL;

  if (!url) {
    throw new Error(
      'Database URL is required. Pass it via options.url or set DATABASE_URL environment variable.',
    );
  }

  const client = postgres(url, {
    max: options.maxConnections ?? 10,
    prepare: false,
    ...(options.logQueries
      ? {
          onnotice: console.log,
        }
      : {}),
  });

  const db = drizzle(client, { schema, logger: options.logQueries });

  return { db, client };
}

/**
 * Create a singleton database client for the application lifecycle.
 *
 * WARNING: Do not call this in hot-reload paths without caching the result.
 */
let cachedClient: DatabaseClient | undefined;

export function getDatabaseClient(options?: ClientOptions): DatabaseClient {
  if (!cachedClient) {
    cachedClient = createDatabaseClient(options);
  }
  return cachedClient;
}

/**
 * Close the database connection pool.
 */
export async function closeDatabaseClient(): Promise<void> {
  if (cachedClient) {
    await cachedClient.client.end();
    cachedClient = undefined;
  }
}
