import { eq } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@alzahra/db/schema';
import type { ITokenRepository } from '../../domain/repositories/token-repository.interface.js';
import type { Token, CreateTokenInput } from '../../domain/entities/token.js';

export class DrizzleTokenRepository implements ITokenRepository {
  constructor(private readonly db: PostgresJsDatabase<typeof schema>) {}

  async findById(id: string): Promise<Token | null> {
    const row = await this.db.query.tokens.findFirst({
      where: eq(schema.tokens.id, id),
    });
    return row ? this.toDomain(row) : null;
  }

  async findByTokenHash(tokenHash: string): Promise<Token | null> {
    const row = await this.db.query.tokens.findFirst({
      where: eq(schema.tokens.tokenHash, tokenHash),
    });
    return row ? this.toDomain(row) : null;
  }

  async findByUserId(userId: string): Promise<Token[]> {
    const rows = await this.db.query.tokens.findMany({
      where: eq(schema.tokens.userId, userId),
    });
    return rows.map((r) => this.toDomain(r));
  }

  async create(input: CreateTokenInput): Promise<Token> {
    const [row] = await this.db
      .insert(schema.tokens)
      .values({
        userId: input.userId,
        type: input.type,
        tokenHash: input.tokenHash,
        expiresAt: input.expiresAt ?? null,
        metadata: input.metadata ?? null,
      })
      .returning();
    return this.toDomain(row);
  }

  async updateLastUsedAt(id: string, date: Date): Promise<void> {
    await this.db
      .update(schema.tokens)
      .set({ lastUsedAt: date })
      .where(eq(schema.tokens.id, id));
  }

  async revoke(id: string): Promise<Token | null> {
    const [row] = await this.db
      .update(schema.tokens)
      .set({ revokedAt: new Date() })
      .where(eq(schema.tokens.id, id))
      .returning();
    return row ? this.toDomain(row) : null;
  }

  async extend(id: string, newExpiresAt: Date): Promise<Token | null> {
    const [row] = await this.db
      .update(schema.tokens)
      .set({ expiresAt: newExpiresAt })
      .where(eq(schema.tokens.id, id))
      .returning();
    return row ? this.toDomain(row) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db
      .delete(schema.tokens)
      .where(eq(schema.tokens.id, id));
    return result.rowCount > 0;
  }

  private toDomain(row: typeof schema.tokens.$inferSelect): Token {
    return {
      id: row.id,
      userId: row.userId,
      type: row.type as Token['type'],
      tokenHash: row.tokenHash,
      expiresAt: row.expiresAt,
      lastUsedAt: row.lastUsedAt,
      createdAt: row.createdAt,
      revokedAt: row.revokedAt,
      metadata: row.metadata,
    };
  }
}
