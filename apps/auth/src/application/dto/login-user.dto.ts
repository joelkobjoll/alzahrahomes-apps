export interface LoginUserDTO {
  email: string;
  password: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}
