import type { Token, CreateTokenInput } from '../entities/token.js';

export interface ITokenRepository {
  findById(id: string): Promise<Token | null>;
  findByTokenHash(tokenHash: string): Promise<Token | null>;
  findByUserId(userId: string): Promise<Token[]>;
  create(input: CreateTokenInput): Promise<Token>;
  updateLastUsedAt(id: string, date: Date): Promise<void>;
  revoke(id: string): Promise<Token | null>;
  extend(id: string, newExpiresAt: Date): Promise<Token | null>;
  delete(id: string): Promise<boolean>;
}
