import type { IUserRepository, ISessionRepository, IAuditLogRepository } from '../../domain/repositories/interfaces.js';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials-error.js';
import type { LoginUserDTO, AuthResultDTO } from '../dto/index.js';

export interface PasswordHasher {
  compare(plain: string, hash: string): Promise<boolean>;
}

export interface TokenGenerator {
  generate(): string;
}

export class LoginUserUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly sessionRepo: ISessionRepository,
    private readonly auditLogRepo: IAuditLogRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenGenerator: TokenGenerator,
    private readonly sessionTtlMs: number,
  ) {}

  async execute(dto: LoginUserDTO): Promise<AuthResultDTO> {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user || user.deletedAt) {
      throw new InvalidCredentialsError();
    }

    if (!user.passwordHash) {
      throw new InvalidCredentialsError('Account has no password set');
    }

    const valid = await this.passwordHasher.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new InvalidCredentialsError();
    }

    const token = this.tokenGenerator.generate();
    const expiresAt = new Date(Date.now() + this.sessionTtlMs);

    const session = await this.sessionRepo.create({
      userId: user.id,
      token,
      expiresAt,
      ipAddress: dto.ipAddress ?? null,
      userAgent: dto.userAgent ?? null,
    });

    await this.auditLogRepo.create({
      userId: user.id,
      action: 'USER_LOGIN',
      entityType: 'user',
      entityId: user.id,
      ipAddress: dto.ipAddress ?? null,
      userAgent: dto.userAgent ?? null,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      sessionToken: session.token,
      expiresAt: session.expiresAt,
    };
  }
}
