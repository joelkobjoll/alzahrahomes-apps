import type { ISessionRepository, IUserRepository } from '../../domain/repositories/interfaces.js';
import { SessionNotFoundError } from '../../domain/errors/session-not-found-error.js';
import { TokenExpiredError } from '../../domain/errors/token-expired-error.js';
import type { ValidateSessionDTO, AuthUserDTO } from '../dto/index.js';

export class ValidateSessionUseCase {
  constructor(
    private readonly sessionRepo: ISessionRepository,
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(dto: ValidateSessionDTO): Promise<AuthUserDTO> {
    const session = await this.sessionRepo.findByToken(dto.token);
    if (!session) {
      throw new SessionNotFoundError();
    }

    if (session.expiresAt < new Date()) {
      await this.sessionRepo.deleteByToken(dto.token);
      throw new TokenExpiredError();
    }

    const user = await this.userRepo.findById(session.userId);
    if (!user || user.deletedAt) {
      throw new SessionNotFoundError('Session user no longer exists');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }
}
