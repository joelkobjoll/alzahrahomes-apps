import type { User, CreateUserInput } from '../entities/user.js';
import type { Session, CreateSessionInput } from '../entities/session.js';
import type { AuditLog, CreateAuditLogInput } from '../entities/audit-log.js';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(input: CreateUserInput): Promise<User>;
  update(id: string, changes: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null>;
  softDelete(id: string): Promise<boolean>;
}

export interface ISessionRepository {
  findByToken(token: string): Promise<Session | null>;
  findByUserId(userId: string): Promise<Session[]>;
  create(input: CreateSessionInput): Promise<Session>;
  deleteByToken(token: string): Promise<boolean>;
  deleteByUserId(userId: string): Promise<boolean>;
  deleteExpired(before: Date): Promise<number>;
}

export interface IAuditLogRepository {
  create(input: CreateAuditLogInput): Promise<AuditLog>;
}
