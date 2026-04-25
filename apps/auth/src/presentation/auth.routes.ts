import { Hono } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import {
  loginSchema,
  registerSchema,
  impersonateSchema,
  getCookieConfig,
} from '@alzahra/auth-config';
import type { DIContainer } from '../infrastructure/di.js';
import { validateRequest } from './middleware/validate-request.js';
import { UnauthorizedError } from '../domain/errors/unauthorized-error.js';

export function createAuthRoutes(di: DIContainer) {
  const app = new Hono();
  const cookieConfig = getCookieConfig(process.env.NODE_ENV === 'development');

  app.post('/login', validateRequest(loginSchema), async (c) => {
    const body = c.get('validatedBody');
    const result = await di.loginUserUseCase.execute({
      email: body.email,
      password: body.password,
      ipAddress: c.req.header('x-forwarded-for') ?? c.req.header('x-real-ip') ?? null,
      userAgent: c.req.header('user-agent') ?? null,
    });

    setCookie(c, cookieConfig.name, result.sessionToken, {
      ...cookieConfig,
      expires: result.expiresAt,
    });

    return c.json({
      data: { user: result.user },
      error: null,
    });
  });

  app.post('/logout', async (c) => {
    const token = getCookie(c, cookieConfig.name);
    if (token) {
      await di.logoutUserUseCase.execute({ token });
      deleteCookie(c, cookieConfig.name);
    }
    return c.json({ data: null, error: null });
  });

  app.post('/register', validateRequest(registerSchema), async (c) => {
    const body = c.get('validatedBody');
    const result = await di.createUserUseCase.execute({
      email: body.email,
      password: body.password,
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone ?? null,
    });

    return c.json({
      data: { user: result.user },
      error: null,
    });
  });

  app.get('/me', async (c) => {
    const token = getCookie(c, cookieConfig.name);
    if (!token) {
      throw new UnauthorizedError('No session cookie');
    }

    const user = await di.validateSessionUseCase.execute({ token });
    return c.json({ data: { user }, error: null });
  });

  app.post('/impersonate', validateRequest(impersonateSchema), async (c) => {
    const body = c.get('validatedBody');
    const actorToken = getCookie(c, cookieConfig.name);
    if (!actorToken) {
      throw new UnauthorizedError('No session cookie');
    }

    const actor = await di.validateSessionUseCase.execute({ token: actorToken });
    const result = await di.impersonateUserUseCase.execute({
      targetUserId: body.targetUserId,
      actorUserId: actor.id,
      ipAddress: c.req.header('x-forwarded-for') ?? c.req.header('x-real-ip') ?? null,
      userAgent: c.req.header('user-agent') ?? null,
    });

    setCookie(c, cookieConfig.name, result.sessionToken, {
      ...cookieConfig,
      expires: result.expiresAt,
    });

    return c.json({
      data: { user: result.user },
      error: null,
    });
  });

  return app;
}
