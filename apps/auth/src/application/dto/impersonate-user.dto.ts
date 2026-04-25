export interface ImpersonateUserDTO {
  targetUserId: string;
  actorUserId: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}
