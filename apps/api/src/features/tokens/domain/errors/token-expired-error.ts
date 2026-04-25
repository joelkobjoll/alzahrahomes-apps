export class TokenExpiredError extends Error {
  readonly code = 'TOKEN_EXPIRED';
  readonly statusCode = 401;

  constructor(message = 'Token has expired') {
    super(message);
    this.name = 'TokenExpiredError';
  }
}
