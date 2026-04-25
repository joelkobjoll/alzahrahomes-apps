import type { Role } from '@alzahra/auth-config';

export interface AuthUserDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface AuthResultDTO {
  user: AuthUserDTO;
  sessionToken: string;
  expiresAt: Date;
}
