import type { IUserRepository } from '../../domain/repositories/interfaces.js';
import { EmailTakenError } from '../../domain/errors/email-taken-error.js';
import type { CreateUserDTO, AuthResultDTO } from '../dto/index.js';

export interface PasswordHasher {
  hash(plain: string): Promise<string>;
}

export class CreateUserUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(dto: CreateUserDTO): Promise<AuthResultDTO> {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) {
      throw new EmailTakenError();
    }

    const passwordHash = await this.passwordHasher.hash(dto.password);

    const user = await this.userRepo.create({
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone ?? null,
      role: dto.role ?? 'guest',
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      sessionToken: '',
      expiresAt: new Date(),
    };
  }
}
