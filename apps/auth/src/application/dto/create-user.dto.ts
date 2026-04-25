import type { Role } from '@alzahra/auth-config';

export interface CreateUserDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role?: Role;
}
