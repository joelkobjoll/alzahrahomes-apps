import { DomainError } from './domain-error.js';

export class UserNotFoundError extends DomainError {
  readonly code = 'USER_NOT_FOUND';
  readonly statusCode = 404;

  constructor(message = 'User not found') {
    super(message);
  }
}
