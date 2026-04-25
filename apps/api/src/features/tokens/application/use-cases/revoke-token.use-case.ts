import type { ITokenRepository } from '../../domain/repositories/token-repository.interface.js';
import { TokenNotFoundError } from '../../domain/errors/token-not-found-error.js';
import type { RevokeTokenDTO } from '../dto/revoke-token.dto.js';
import type { Token } from '../../domain/entities/token.js';

export class RevokeTokenUseCase {
  constructor(private readonly tokenRepo: ITokenRepository) {}

  async execute(dto: RevokeTokenDTO): Promise<Token> {
    const token = await this.tokenRepo.revoke(dto.id);
    if (!token) {
      throw new TokenNotFoundError();
    }
    return token;
  }
}
