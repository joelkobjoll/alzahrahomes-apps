/**
 * Base class for all domain errors.
 * Do NOT throw generic Error inside use cases — always use a typed subclass.
 */
export abstract class DomainError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace?.(this, this.constructor);
  }
}
