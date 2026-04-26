import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@alzahra/db/schema';
import type { IAuditLogRepository } from '../../domain/repositories/interfaces.js';
import type { AuditLog, CreateAuditLogInput } from '../../domain/entities/audit-log.js';

export class DrizzleAuditLogRepository implements IAuditLogRepository {
  constructor(private readonly db: PostgresJsDatabase<typeof schema>) {}

  async create(input: CreateAuditLogInput): Promise<AuditLog> {
    const result = await this.db
      .insert(schema.auditLogs)
      .values({
        userId: input.userId ?? null,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId ?? null,
        metadata: input.metadata ?? null,
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
      })
      .returning();
    const row = result[0]!;
    return this.toDomain(row);
  }

  private toDomain(row: typeof schema.auditLogs.$inferSelect): AuditLog {
    return {
      id: row.id,
      userId: row.userId,
      action: row.action,
      entityType: row.entityType,
      entityId: row.entityId,
      metadata: row.metadata as Record<string, unknown> | null,
      ipAddress: row.ipAddress,
      userAgent: row.userAgent,
      createdAt: row.createdAt,
    };
  }
}
