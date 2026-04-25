import { DomainError } from './domain-error.js';

export class TokenExpiredError extends DomainError {
  readonly code = 'TOKEN_EXPIRED';
  readonly statusCode = 401;

  constructor(message = 'Token has expired') {
    super(message);
  }
}
