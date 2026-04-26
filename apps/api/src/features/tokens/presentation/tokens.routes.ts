import { Hono } from 'hono';
import { z } from 'zod';
import type { GenerateTokenUseCase } from '../application/use-cases/generate-token.use-case.js';
import type { ValidateTokenUseCase } from '../application/use-cases/validate-token.use-case.js';
import type { RevokeTokenUseCase } from '../application/use-cases/revoke-token.use-case.js';
import type { ExtendTokenUseCase } from '../application/use-cases/extend-token.use-case.js';
import { TokenNotFoundError } from '../domain/errors/token-not-found-error.js';
import { TokenExpiredError } from '../domain/errors/token-expired-error.js';
import { TokenRevokedError } from '../domain/errors/token-revoked-error.js';

export interface TokensDI {
  generateTokenUseCase: GenerateTokenUseCase;
  validateTokenUseCase: ValidateTokenUseCase;
  revokeTokenUseCase: RevokeTokenUseCase;
  extendTokenUseCase: ExtendTokenUseCase;
}

const generateSchema = z.object({
  userId: z.string().uuid(),
  type: z.enum(['api', 'refresh', 'reset_password', 'verify_email']),
  expiresAt: z.string().datetime().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const extendSchema = z.object({
  newExpiresAt: z.string().datetime(),
});

export function createTokensRoutes(di: TokensDI) {
  const app = new Hono();

  app.post('/', async (c) => {
    const body = generateSchema.parse(await c.req.json());
    const result = await di.generateTokenUseCase.execute({
      userId: body.userId,
      type: body.type,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      metadata: body.metadata ?? null,
    });
    c.status(201);
    return c.json({ data: { token: result.token, plainToken: result.plainToken }, error: null });
  });

  app.get('/validate', async (c) => {
    const headerToken = c.req.header('x-guest-token');
    if (!headerToken) {
      return c.json({
        data: null,
        error: { status: 400, code: 'MISSING_TOKEN', message: 'x-guest-token header is required' },
      }, 400);
    }
    const token = await di.validateTokenUseCase.execute({ token: headerToken });
    return c.json({ data: token, error: null });
  });

  app.post('/:id/revoke', async (c) => {
    const id = c.req.param('id');
    const token = await di.revokeTokenUseCase.execute({ id });
    return c.json({ data: token, error: null });
  });

  app.post('/:id/extend', async (c) => {
    const id = c.req.param('id');
    const body = extendSchema.parse(await c.req.json());
    const token = await di.extendTokenUseCase.execute({
      id,
      newExpiresAt: new Date(body.newExpiresAt),
    });
    return c.json({ data: token, error: null });
  });

  app.onError((err, c) => {
    if (err instanceof TokenNotFoundError) {
      c.status(404);
      return c.json({
        data: null,
        error: { status: 404, code: err.code, message: err.message },
      });
    }
    if (err instanceof TokenExpiredError || err instanceof TokenRevokedError) {
      c.status(401);
      return c.json({
        data: null,
        error: { status: 401, code: err instanceof TokenExpiredError ? 'TOKEN_EXPIRED' : 'TOKEN_REVOKED', message: err.message },
      });
    }
    if (err instanceof z.ZodError) {
      c.status(400);
      return c.json({
        data: null,
        error: {
          status: 400,
          code: 'VALIDATION_ERROR',
          message: 'Invalid request',
          details: err.issues.reduce(
            (acc, issue) => {
              const path = issue.path.join('.');
              acc[path] = acc[path] ?? [];
              acc[path].push(issue.message);
              return acc;
            },
            {} as Record<string, string[]>,
          ),
        },
      });
    }
    throw err;
  });

  return app;
}
