import type { Role } from '../../domain/entities/user.js';

export interface CreateUserDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role?: Role;
}
