/**
 * Cookie configuration for staff session authentication.
 *
 * Guest tokens use the `x-guest-token` header — NEVER store them in cookies.
 */

export interface CookieConfig {
  name: string;
  maxAge: number;
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  path: string;
}

/** Production-safe defaults */
export const DEFAULT_COOKIE_CONFIG: CookieConfig = {
  name: 'alzahra_session',
  maxAge: 60 * 60 * 24 * 7, // 7 days
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/',
};

/** Development overrides (callers can merge these) */
export const DEV_COOKIE_CONFIG: Partial<CookieConfig> = {
  secure: false,
  sameSite: 'lax',
};

export function getCookieConfig(isDev = false): CookieConfig {
  return {
    ...DEFAULT_COOKIE_CONFIG,
    ...(isDev ? DEV_COOKIE_CONFIG : {}),
  };
}
