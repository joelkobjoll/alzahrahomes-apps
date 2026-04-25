import { faker } from '@faker-js/faker';
import type { Token, TokenType } from '@alzahra/types';

export class TokenFactory {
  static create(overrides?: Partial<Token>): Token {
    const now = new Date();
    return {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      type: 'api' as TokenType,
      tokenHash: faker.string.alphanumeric(64),
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      lastUsedAt: null,
      createdAt: now,
      revokedAt: null,
      metadata: null,
      ...overrides,
    };
  }

  static active(overrides?: Partial<Token>): Token {
    const now = new Date();
    return this.create({
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      revokedAt: null,
      lastUsedAt: now,
      ...overrides,
    });
  }

  static expired(overrides?: Partial<Token>): Token {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.create({
      expiresAt: yesterday,
      revokedAt: null,
      ...overrides,
    });
  }

  static revoked(overrides?: Partial<Token>): Token {
    const now = new Date();
    return this.create({
      revokedAt: now,
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      ...overrides,
    });
  }
}
