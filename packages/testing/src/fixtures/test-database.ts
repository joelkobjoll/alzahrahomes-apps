import { GenericContainer, type StartedTestContainer, Wait } from 'testcontainers';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@alzahra/db/schema';

export interface TestDatabase {
  container: StartedTestContainer;
  client: postgres.Sql;
  db: ReturnType<typeof drizzle<typeof schema>>;
}

let sharedContainer: StartedTestContainer | undefined;
let sharedClient: postgres.Sql | undefined;

/**
 * Start a PostgreSQL container for integration tests.
 * Reuses the same container across calls unless `fresh: true` is passed.
 */
export async function startTestDatabase(options?: { fresh?: boolean }): Promise<TestDatabase> {
  if (!sharedContainer || options?.fresh) {
    const container = await new GenericContainer('postgres:16-alpine')
      .withEnvironment({
        POSTGRES_DB: 'test',
        POSTGRES_USER: 'test',
        POSTGRES_PASSWORD: 'test',
      })
      .withExposedPorts(5432)
      .withWaitStrategy(Wait.forLogMessage('database system is ready to accept connections'))
      .start();

    sharedContainer = container;
    const connectionString = `postgresql://test:test@${container.getHost()}:${container.getMappedPort(5432)}/test`;
    sharedClient = postgres(connectionString, { max: 10, prepare: false });
  }

  const client = sharedClient!;
  const db = drizzle(client, { schema });

  return { container: sharedContainer, client, db };
}

/**
 * Run Drizzle migrations against the test database.
 * Expects a migrations folder at the monorepo root or relative path.
 */
export async function runMigrations(db: TestDatabase['db'], migrationsPath?: string): Promise<void> {
  const { migrate } = await import('drizzle-orm/postgres-js/migrator');
  await migrate(db, { migrationsFolder: migrationsPath ?? '../../packages/db/drizzle' });
}

/**
 * Truncate all tables to clean state between tests.
 */
export async function truncateTables(client: postgres.Sql): Promise<void> {
  const tables = [
    'audit_logs',
    'property_recs',
    'recommendations',
    'feedback',
    'events',
    'messages',
    'bookings',
    'tokens',
    'properties',
    'sessions',
    'users',
  ];

  for (const table of tables) {
    await client.unsafe(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`);
  }
}

/**
 * Stop the shared test database container.
 */
export async function stopTestDatabase(): Promise<void> {
  if (sharedClient) {
    await sharedClient.end();
    sharedClient = undefined;
  }
  if (sharedContainer) {
    await sharedContainer.stop();
    sharedContainer = undefined;
  }
}
