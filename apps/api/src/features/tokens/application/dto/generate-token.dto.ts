import type { TokenType } from '../../domain/entities/token.js';

export interface GenerateTokenDTO {
  userId: string;
  type: TokenType;
  expiresAt?: Date | null;
  metadata?: Record<string, unknown> | null;
}
