export class TokenNotFoundError extends Error {
  readonly code = 'TOKEN_NOT_FOUND';
  readonly statusCode = 404;

  constructor(message = 'Token not found') {
    super(message);
    this.name = 'TokenNotFoundError';
  }
}
