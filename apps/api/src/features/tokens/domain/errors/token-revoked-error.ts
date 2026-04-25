export class TokenRevokedError extends Error {
  readonly code = 'TOKEN_REVOKED';
  readonly statusCode = 401;

  constructor(message = 'Token has been revoked') {
    super(message);
    this.name = 'TokenRevokedError';
  }
}
