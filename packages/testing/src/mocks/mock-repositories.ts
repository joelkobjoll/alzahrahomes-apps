import type { Token, Property, User, TokenType, UserRole, PropertyStatus, PropertyCategory } from '@alzahra/types';

// ------------------------------------------------------------------
// Domain repository interfaces (mirrors the expected app contracts)
// ------------------------------------------------------------------

export interface ITokenRepository {
  findById(id: string): Promise<Token | undefined>;
  findByHash(tokenHash: string): Promise<Token | undefined>;
  findByUserId(userId: string): Promise<Token[]>;
  findActiveByUserId(userId: string, type: TokenType): Promise<Token | undefined>;
  create(data: Omit<Token, 'id' | 'createdAt'>): Promise<Token>;
  revoke(id: string): Promise<Token | undefined>;
  delete(id: string): Promise<boolean>;
}

export interface IPropertyRepository {
  findById(id: string): Promise<Property | undefined>;
  findBySlug(slug: string): Promise<Property | undefined>;
  findAll(options?: { status?: PropertyStatus; category?: PropertyCategory; limit?: number; offset?: number }): Promise<Property[]>;
  create(data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property>;
  update(id: string, data: Partial<Omit<Property, 'id' | 'createdAt'>>): Promise<Property | undefined>;
  delete(id: string): Promise<boolean>;
}

export interface IUserRepository {
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  findAll(options?: { role?: UserRole; limit?: number; offset?: number }): Promise<User[]>;
  create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  update(id: string, data: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | undefined>;
  delete(id: string): Promise<boolean>;
  softDelete(id: string): Promise<User | undefined>;
}

// ------------------------------------------------------------------
// In-memory implementations
// ------------------------------------------------------------------

export class InMemoryTokenRepository implements ITokenRepository {
  private tokens: Map<string, Token> = new Map();

  async findById(id: string): Promise<Token | undefined> {
    return this.tokens.get(id);
  }

  async findByHash(tokenHash: string): Promise<Token | undefined> {
    return Array.from(this.tokens.values()).find((t) => t.tokenHash === tokenHash);
  }

  async findByUserId(userId: string): Promise<Token[]> {
    return Array.from(this.tokens.values()).filter((t) => t.userId === userId);
  }

  async findActiveByUserId(userId: string, type: TokenType): Promise<Token | undefined> {
    const now = new Date();
    return Array.from(this.tokens.values()).find(
      (t) =>
        t.userId === userId &&
        t.type === type &&
        t.revokedAt === null &&
        (t.expiresAt === null || t.expiresAt > now)
    );
  }

  async create(data: Omit<Token, 'id' | 'createdAt'>): Promise<Token> {
    const token: Token = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    this.tokens.set(token.id, token);
    return token;
  }

  async revoke(id: string): Promise<Token | undefined> {
    const token = this.tokens.get(id);
    if (!token) return undefined;
    const updated = { ...token, revokedAt: new Date() };
    this.tokens.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.tokens.delete(id);
  }

  /** Clear all stored tokens (test helper) */
  clear(): void {
    this.tokens.clear();
  }
}

export class InMemoryPropertyRepository implements IPropertyRepository {
  private properties: Map<string, Property> = new Map();

  async findById(id: string): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async findBySlug(slug: string): Promise<Property | undefined> {
    return Array.from(this.properties.values()).find((p) => p.slug === slug);
  }

  async findAll(options?: { status?: PropertyStatus; category?: PropertyCategory; limit?: number; offset?: number }): Promise<Property[]> {
    let items = Array.from(this.properties.values());
    if (options?.status) {
      items = items.filter((p) => p.status === options.status);
    }
    if (options?.category) {
      items = items.filter((p) => p.category === options.category);
    }
    const offset = options?.offset ?? 0;
    const limit = options?.limit ?? items.length;
    return items.slice(offset, offset + limit);
  }

  async create(data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property> {
    const now = new Date();
    const property: Property = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    this.properties.set(property.id, property);
    return property;
  }

  async update(id: string, data: Partial<Omit<Property, 'id' | 'createdAt'>>): Promise<Property | undefined> {
    const existing = this.properties.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data, updatedAt: new Date() };
    this.properties.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.properties.delete(id);
  }

  /** Clear all stored properties (test helper) */
  clear(): void {
    this.properties.clear();
  }
}

export class InMemoryUserRepository implements IUserRepository {
  private users: Map<string, User> = new Map();

  async findById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
  }

  async findAll(options?: { role?: UserRole; limit?: number; offset?: number }): Promise<User[]> {
    let items = Array.from(this.users.values());
    if (options?.role) {
      items = items.filter((u) => u.role === options.role);
    }
    const offset = options?.offset ?? 0;
    const limit = options?.limit ?? items.length;
    return items.slice(offset, offset + limit);
  }

  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const now = new Date();
    const user: User = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(user.id, user);
    return user;
  }

  async update(id: string, data: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | undefined> {
    const existing = this.users.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data, updatedAt: new Date() };
    this.users.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  async softDelete(id: string): Promise<User | undefined> {
    const existing = this.users.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, deletedAt: new Date(), updatedAt: new Date() };
    this.users.set(id, updated);
    return updated;
  }

  /** Clear all stored users (test helper) */
  clear(): void {
    this.users.clear();
  }
}
