import { eq, lt } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@alzahra/db/schema';
import type { ISessionRepository } from '../../domain/repositories/interfaces.js';
import type { Session, CreateSessionInput } from '../../domain/entities/session.js';

export class DrizzleSessionRepository implements ISessionRepository {
  constructor(private readonly db: PostgresJsDatabase<typeof schema>) {}

  async findByToken(token: string): Promise<Session | null> {
    const row = await this.db.query.sessions.findFirst({
      where: eq(schema.sessions.token, token),
    });
    return row ? this.toDomain(row) : null;
  }

  async findByUserId(userId: string): Promise<Session[]> {
    const rows = await this.db.query.sessions.findMany({
      where: eq(schema.sessions.userId, userId),
    });
    return rows.map((r) => this.toDomain(r));
  }

  async create(input: CreateSessionInput): Promise<Session> {
    const result = await this.db
      .insert(schema.sessions)
      .values({
        userId: input.userId,
        token: input.token,
        expiresAt: input.expiresAt,
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
      })
      .returning();
    const row = result[0]!;
    return this.toDomain(row);
  }

  async deleteByToken(token: string): Promise<boolean> {
    const result = await this.db
      .delete(schema.sessions)
      .where(eq(schema.sessions.token, token))
      .returning();
    return result.length > 0;
  }

  async deleteByUserId(userId: string): Promise<boolean> {
    const result = await this.db
      .delete(schema.sessions)
      .where(eq(schema.sessions.userId, userId))
      .returning();
    return result.length > 0;
  }

  async deleteExpired(before: Date): Promise<number> {
    const result = await this.db
      .delete(schema.sessions)
      .where(lt(schema.sessions.expiresAt, before))
      .returning();
    return result.length;
  }

  private toDomain(row: typeof schema.sessions.$inferSelect): Session {
    return {
      id: row.id,
      userId: row.userId,
      token: row.token,
      expiresAt: row.expiresAt,
      createdAt: row.createdAt,
      ipAddress: row.ipAddress,
      userAgent: row.userAgent,
    };
  }
}
