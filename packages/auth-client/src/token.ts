import { z } from 'zod';

const guestTokenSchema = z.string().uuid();

/**
 * Validate a guest token string.
 * Returns the token if valid, otherwise null.
 */
export function validateGuestToken(token: string | undefined | null): string | null {
  if (!token) return null;
  const result = guestTokenSchema.safeParse(token);
  return result.success ? result.data : null;
}

/**
 * Extract the guest token from request headers.
 */
export function getGuestTokenFromHeaders(headers: Headers): string | null {
  const token = headers.get('x-guest-token');
  return validateGuestToken(token);
}

/**
 * Extract the guest token from a generic object (e.g. Next.js headers() result).
 */
export function getGuestTokenFromObject(obj: Record<string, string | string[] | undefined>): string | null {
  const raw = obj['x-guest-token'];
  const token = Array.isArray(raw) ? raw[0] : raw;
  return validateGuestToken(token);
}
