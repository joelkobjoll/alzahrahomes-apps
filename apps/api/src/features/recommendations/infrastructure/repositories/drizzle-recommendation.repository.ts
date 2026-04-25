import { eq, count, sql } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@alzahra/db/schema';
import type { IRecommendationRepository } from '../../domain/repositories/recommendation-repository.interface.js';
import type { Recommendation } from '../../domain/entities/recommendation.js';

export class DrizzleRecommendationRepository implements IRecommendationRepository {
  constructor(private readonly db: PostgresJsDatabase<typeof schema>) {}

  async findById(id: string): Promise<Recommendation | null> {
    const row = await this.db.query.recommendations.findFirst({
      where: eq(schema.recommendations.id, id),
    });
    return row ? this.toDomain(row) : null;
  }

  async findMany(options: { limit: number; offset: number }): Promise<{ items: Recommendation[]; total: number }> {
    const rows = await this.db.query.recommendations.findMany({
      limit: options.limit,
      offset: options.offset,
      orderBy: (t) => [sql`${t.createdAt} DESC`],
    });
    const [{ value }] = await this.db.select({ value: count() }).from(schema.recommendations);
    return { items: rows.map((r) => this.toDomain(r)), total: Number(value) };
  }

  async create(input: Omit<Recommendation, 'id' | 'createdAt'>): Promise<Recommendation> {
    const [row] = await this.db.insert(schema.recommendations).values(input).returning();
    return this.toDomain(row);
  }

  async update(id: string, changes: Partial<Omit<Recommendation, 'id' | 'createdAt'>>): Promise<Recommendation | null> {
    const [row] = await this.db.update(schema.recommendations).set(changes).where(eq(schema.recommendations.id, id)).returning();
    return row ? this.toDomain(row) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.delete(schema.recommendations).where(eq(schema.recommendations.id, id));
    return result.rowCount > 0;
  }

  private toDomain(row: typeof schema.recommendations.$inferSelect): Recommendation {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      type: row.type as Recommendation['type'],
      filters: row.filters,
      score: row.score,
      validFrom: row.validFrom,
      validUntil: row.validUntil,
      createdAt: row.createdAt,
    };
  }
}
