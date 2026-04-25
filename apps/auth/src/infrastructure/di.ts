import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@alzahra/db/schema';
import { DrizzleUserRepository } from './repositories/drizzle-user.repository.js';
import { DrizzleSessionRepository } from './repositories/drizzle-session.repository.js';
import { DrizzleAuditLogRepository } from './repositories/drizzle-audit-log.repository.js';
import { BcryptPasswordHasher, CryptoTokenGenerator } from './crypto/password-hasher.js';
import { LoginUserUseCase } from '../application/use-cases/login-user.use-case.js';
import { LogoutUserUseCase } from '../application/use-cases/logout-user.use-case.js';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case.js';
import { ValidateSessionUseCase } from '../application/use-cases/validate-session.use-case.js';
import { ImpersonateUserUseCase } from '../application/use-cases/impersonate-user.use-case.js';

export interface DIContainer {
  loginUserUseCase: LoginUserUseCase;
  logoutUserUseCase: LogoutUserUseCase;
  createUserUseCase: CreateUserUseCase;
  validateSessionUseCase: ValidateSessionUseCase;
  impersonateUserUseCase: ImpersonateUserUseCase;
}

export function createDIContainer(databaseUrl: string): DIContainer {
  const client = postgres(databaseUrl, { prepare: false });
  const db = drizzle(client, { schema });

  const userRepo = new DrizzleUserRepository(db);
  const sessionRepo = new DrizzleSessionRepository(db);
  const auditLogRepo = new DrizzleAuditLogRepository(db);

  const passwordHasher = new BcryptPasswordHasher();
  const tokenGenerator = new CryptoTokenGenerator();
  const sessionTtlMs = 1000 * 60 * 60 * 24 * 7; // 7 days

  return {
    loginUserUseCase: new LoginUserUseCase(
      userRepo,
      sessionRepo,
      auditLogRepo,
      passwordHasher,
      tokenGenerator,
      sessionTtlMs,
    ),
    logoutUserUseCase: new LogoutUserUseCase(sessionRepo),
    createUserUseCase: new CreateUserUseCase(userRepo, passwordHasher),
    validateSessionUseCase: new ValidateSessionUseCase(sessionRepo, userRepo),
    impersonateUserUseCase: new ImpersonateUserUseCase(
      userRepo,
      sessionRepo,
      auditLogRepo,
      tokenGenerator,
      sessionTtlMs,
    ),
  };
}
