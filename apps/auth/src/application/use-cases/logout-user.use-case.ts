import type { ISessionRepository } from '../../domain/repositories/interfaces.js';
import type { LogoutUserDTO } from '../dto/index.js';

export class LogoutUserUseCase {
  constructor(private readonly sessionRepo: ISessionRepository) {}

  async execute(dto: LogoutUserDTO): Promise<void> {
    await this.sessionRepo.deleteByToken(dto.token);
  }
}
