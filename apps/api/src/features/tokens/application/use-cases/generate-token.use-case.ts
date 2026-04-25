import type { ITokenRepository } from '../../domain/repositories/token-repository.interface.js';
import type { GenerateTokenDTO } from '../dto/generate-token.dto.js';
import type { Token } from '../../domain/entities/token.js';

export interface TokenHasher {
  hash(plain: string): string;
}

export interface TokenGenerator {
  generate(): string;
}

export class GenerateTokenUseCase {
  constructor(
    private readonly tokenRepo: ITokenRepository,
    private readonly tokenHasher: TokenHasher,
    private readonly tokenGenerator: TokenGenerator,
  ) {}

  async execute(dto: GenerateTokenDTO): Promise<{ token: Token; plainToken: string }> {
    const plainToken = this.tokenGenerator.generate();
    const tokenHash = this.tokenHasher.hash(plainToken);

    const token = await this.tokenRepo.create({
      userId: dto.userId,
      type: dto.type,
      tokenHash,
      expiresAt: dto.expiresAt ?? null,
      metadata: dto.metadata ?? null,
    });

    return { token, plainToken };
  }
}
