export class SlugTakenError extends Error {
  readonly code = 'SLUG_TAKEN';
  readonly statusCode = 409;

  constructor(message = 'Property slug is already taken') {
    super(message);
    this.name = 'SlugTakenError';
  }
}
