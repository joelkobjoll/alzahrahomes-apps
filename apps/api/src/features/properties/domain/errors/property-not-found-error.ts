export class PropertyNotFoundError extends Error {
  readonly code = 'PROPERTY_NOT_FOUND';
  readonly statusCode = 404;

  constructor(message = 'Property not found') {
    super(message);
    this.name = 'PropertyNotFoundError';
  }
}
