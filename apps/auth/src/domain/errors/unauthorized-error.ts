import { DomainError } from './domain-error.js';

export class UnauthorizedError extends DomainError {
  readonly code = 'UNAUTHORIZED';
  readonly statusCode = 401;

  constructor(message = 'Unauthorized') {
    super(message);
  }
}
