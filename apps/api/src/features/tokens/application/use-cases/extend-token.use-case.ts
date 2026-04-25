import type { ITokenRepository } from '../../domain/repositories/token-repository.interface.js';
import { TokenNotFoundError } from '../../domain/errors/token-not-found-error.js';
import { TokenRevokedError } from '../../domain/errors/token-revoked-error.js';
import type { ExtendTokenDTO } from '../dto/extend-token.dto.js';
import type { Token } from '../../domain/entities/token.js';

export class ExtendTokenUseCase {
  constructor(private readonly tokenRepo: ITokenRepository) {}

  async execute(dto: ExtendTokenDTO): Promise<Token> {
    const existing = await this.tokenRepo.findById(dto.id);
    if (!existing) {
      throw new TokenNotFoundError();
    }

    if (existing.revokedAt) {
      throw new TokenRevokedError('Cannot extend a revoked token');
    }

    const token = await this.tokenRepo.extend(dto.id, dto.newExpiresAt);
    if (!token) {
      throw new TokenNotFoundError();
    }
    return token;
  }
}
