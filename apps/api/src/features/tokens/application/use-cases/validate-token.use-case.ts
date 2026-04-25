import type { ITokenRepository } from '../../domain/repositories/token-repository.interface.js';
import { TokenNotFoundError } from '../../domain/errors/token-not-found-error.js';
import { TokenExpiredError } from '../../domain/errors/token-expired-error.js';
import { TokenRevokedError } from '../../domain/errors/token-revoked-error.js';
import type { ValidateTokenDTO } from '../dto/validate-token.dto.js';
import type { Token } from '../../domain/entities/token.js';

export interface TokenHasher {
  hash(plain: string): string;
}

export class ValidateTokenUseCase {
  constructor(
    private readonly tokenRepo: ITokenRepository,
    private readonly tokenHasher: TokenHasher,
  ) {}

  async execute(dto: ValidateTokenDTO): Promise<Token> {
    const tokenHash = this.tokenHasher.hash(dto.token);
    const token = await this.tokenRepo.findByTokenHash(tokenHash);

    if (!token) {
      throw new TokenNotFoundError();
    }

    if (token.revokedAt) {
      throw new TokenRevokedError();
    }

    if (token.expiresAt && token.expiresAt < new Date()) {
      throw new TokenExpiredError();
    }

    await this.tokenRepo.updateLastUsedAt(token.id, new Date());
    return token;
  }
}
