import { z } from 'zod';

// ============================================================================
// Auth request/response DTO schemas (Zod)
// ============================================================================

export const emailSchema = z.string().email().max(255);
export const passwordSchema = z
  .string()
  .min(8)
  .max(128)
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Must contain at least one number');

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  phone: z.string().max(50).optional(),
});

export const impersonateSchema = z.object({
  targetUserId: z.string().uuid(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

// ============================================================================
// Auth response DTOs
// ============================================================================

export const authUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(['guest', 'super_admin', 'admin', 'property_manager', 'operations', 'support']),
});

export const loginResponseSchema = z.object({
  user: authUserSchema,
});

export const meResponseSchema = z.object({
  user: authUserSchema.nullable(),
});

// ============================================================================
// Guest token schemas
// ============================================================================

export const guestTokenHeaderSchema = z.string().uuid().optional();

// ============================================================================
// Export types
// ============================================================================

export type LoginDTO = z.infer<typeof loginSchema>;
export type RegisterDTO = z.infer<typeof registerSchema>;
export type ImpersonateDTO = z.infer<typeof impersonateSchema>;
export type RefreshTokenDTO = z.infer<typeof refreshTokenSchema>;
export type AuthUserDTO = z.infer<typeof authUserSchema>;
export type LoginResponseDTO = z.infer<typeof loginResponseSchema>;
export type MeResponseDTO = z.infer<typeof meResponseSchema>;
