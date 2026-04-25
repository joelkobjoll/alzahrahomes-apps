import type { IUserRepository, ISessionRepository, IAuditLogRepository } from '../../domain/repositories/interfaces.js';
import { UserNotFoundError } from '../../domain/errors/user-not-found-error.js';
import { UnauthorizedError } from '../../domain/errors/unauthorized-error.js';
import { can } from '@alzahra/auth-client';
import { PERMISSION_IMPERSONATE } from '@alzahra/auth-config';
import type { ImpersonateUserDTO, AuthResultDTO } from '../dto/index.js';

export interface TokenGenerator {
  generate(): string;
}

export class ImpersonateUserUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly sessionRepo: ISessionRepository,
    private readonly auditLogRepo: IAuditLogRepository,
    private readonly tokenGenerator: TokenGenerator,
    private readonly sessionTtlMs: number,
  ) {}

  async execute(dto: ImpersonateUserDTO): Promise<AuthResultDTO> {
    const actor = await this.userRepo.findById(dto.actorUserId);
    if (!actor || actor.deletedAt) {
      throw new UnauthorizedError('Actor not found');
    }

    if (!can(actor.role, PERMISSION_IMPERSONATE)) {
      throw new UnauthorizedError('You do not have permission to impersonate');
    }

    const target = await this.userRepo.findById(dto.targetUserId);
    if (!target || target.deletedAt) {
      throw new UserNotFoundError('Target user not found');
    }

    const token = this.tokenGenerator.generate();
    const expiresAt = new Date(Date.now() + this.sessionTtlMs);

    const session = await this.sessionRepo.create({
      userId: target.id,
      token,
      expiresAt,
      ipAddress: dto.ipAddress ?? null,
      userAgent: dto.userAgent ?? null,
    });

    await this.auditLogRepo.create({
      userId: actor.id,
      action: 'USER_IMPERSONATE',
      entityType: 'user',
      entityId: target.id,
      metadata: { impersonatedBy: actor.id, targetUserId: target.id },
      ipAddress: dto.ipAddress ?? null,
      userAgent: dto.userAgent ?? null,
    });

    return {
      user: {
        id: target.id,
        email: target.email,
        firstName: target.firstName,
        lastName: target.lastName,
        role: target.role,
      },
      sessionToken: session.token,
      expiresAt: session.expiresAt,
    };
  }
}
