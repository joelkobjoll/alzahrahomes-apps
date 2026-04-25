import { DomainError } from './domain-error.js';

export class SessionNotFoundError extends DomainError {
  readonly code = 'SESSION_NOT_FOUND';
  readonly statusCode = 401;

  constructor(message = 'Session not found') {
    super(message);
  }
}
