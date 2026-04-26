import { eq } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@alzahra/db/schema';
import type { IUserRepository } from '../../domain/repositories/interfaces.js';
import type { User, CreateUserInput } from '../../domain/entities/user.js';

export class DrizzleUserRepository implements IUserRepository {
  constructor(private readonly db: PostgresJsDatabase<typeof schema>) {}

  async findById(id: string): Promise<User | null> {
    const row = await this.db.query.users.findFirst({
      where: eq(schema.users.id, id),
    });
    return row ? this.toDomain(row) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });
    return row ? this.toDomain(row) : null;
  }

  async create(input: CreateUserInput): Promise<User> {
    const result = await this.db
      .insert(schema.users)
      .values({
        email: input.email,
        passwordHash: input.passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone ?? null,
        role: (input.role ?? 'guest') as 'guest' | 'admin' | 'owner' | 'staff',
      })
      .returning();
    const row = result[0]!;
    return this.toDomain(row);
  }

  async update(id: string, changes: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> {
    const result = await this.db
      .update(schema.users)
      .set({
        ...changes,
        role: changes.role as 'guest' | 'admin' | 'owner' | 'staff' | undefined,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, id))
      .returning();
    const row = result[0];
    return row ? this.toDomain(row) : null;
  }

  async softDelete(id: string): Promise<boolean> {
    const [row] = await this.db
      .update(schema.users)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(schema.users.id, id))
      .returning();
    return !!row;
  }

  private toDomain(row: typeof schema.users.$inferSelect): User {
    return {
      id: row.id,
      email: row.email,
      passwordHash: row.passwordHash,
      firstName: row.firstName,
      lastName: row.lastName,
      phone: row.phone,
      role: row.role as User['role'],
      avatarUrl: row.avatarUrl,
      emailVerified: row.emailVerified,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      deletedAt: row.deletedAt,
    };
  }
}
