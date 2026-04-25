import type { TokenType } from '@alzahra/validators';

export interface Token {
  id: string;
  userId: string;
  type: TokenType;
  tokenHash: string;
  expiresAt: Date | null;
  lastUsedAt: Date | null;
  createdAt: Date;
  revokedAt: Date | null;
  metadata: Record<string, unknown> | null;
}

export interface CreateTokenInput {
  userId: string;
  type: TokenType;
  tokenHash: string;
  expiresAt?: Date | null;
  metadata?: Record<string, unknown> | null;
}
