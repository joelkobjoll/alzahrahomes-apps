import { DomainError } from './domain-error.js';

export class EmailTakenError extends DomainError {
  readonly code = 'EMAIL_TAKEN';
  readonly statusCode = 409;

  constructor(message = 'Email is already taken') {
    super(message);
  }
}
