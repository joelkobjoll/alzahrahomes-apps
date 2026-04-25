import type { TokenType } from '@alzahra/validators';

export interface GenerateTokenDTO {
  userId: string;
  type: TokenType;
  expiresAt?: Date | null;
  metadata?: Record<string, unknown> | null;
}
