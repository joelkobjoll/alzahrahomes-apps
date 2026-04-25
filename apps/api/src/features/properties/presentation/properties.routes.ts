import { Hono } from 'hono';
import { z } from 'zod';
import {
  createPropertyRequestSchema,
  updatePropertyRequestSchema,
  propertySearchRequestSchema,
} from '@alzahra/validators';
import type { CreatePropertyUseCase } from '../application/use-cases/create-property.use-case.js';
import type { GetPropertyByIdUseCase } from '../application/use-cases/get-property-by-id.use-case.js';
import type { ListPropertiesUseCase } from '../application/use-cases/list-properties.use-case.js';
import type { UpdatePropertyUseCase } from '../application/use-cases/update-property.use-case.js';
import type { DeletePropertyUseCase } from '../application/use-cases/delete-property.use-case.js';
import { PropertyNotFoundError } from '../domain/errors/property-not-found-error.js';
import { SlugTakenError } from '../domain/errors/slug-taken-error.js';

export interface PropertiesDI {
  createPropertyUseCase: CreatePropertyUseCase;
  getPropertyByIdUseCase: GetPropertyByIdUseCase;
  listPropertiesUseCase: ListPropertiesUseCase;
  updatePropertyUseCase: UpdatePropertyUseCase;
  deletePropertyUseCase: DeletePropertyUseCase;
}

export function createPropertiesRoutes(di: PropertiesDI) {
  const app = new Hono();

  app.get('/', async (c) => {
    const query = propertySearchRequestSchema.parse(c.req.query());
    const result = await di.listPropertiesUseCase.execute({
      page: query.page,
      limit: query.limit,
      city: query.city,
      country: query.country,
      category: query.category,
      status: query.status,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      minGuests: query.minGuests,
    });
    return c.json({ data: result, error: null });
  });

  app.get('/:id', async (c) => {
    const id = c.req.param('id');
    const property = await di.getPropertyByIdUseCase.execute(id);
    return c.json({ data: property, error: null });
  });

  app.post('/', async (c) => {
    const body = createPropertyRequestSchema.parse(await c.req.json());
    const property = await di.createPropertyUseCase.execute(body);
    c.status(201);
    return c.json({ data: property, error: null });
  });

  app.patch('/:id', async (c) => {
    const id = c.req.param('id');
    const body = updatePropertyRequestSchema.parse(await c.req.json());
    const property = await di.updatePropertyUseCase.execute(id, body);
    return c.json({ data: property, error: null });
  });

  app.delete('/:id', async (c) => {
    const id = c.req.param('id');
    await di.deletePropertyUseCase.execute(id);
    return c.json({ data: null, error: null });
  });

  app.onError((err, c) => {
    if (err instanceof PropertyNotFoundError) {
      c.status(404);
      return c.json({
        data: null,
        error: { status: 404, code: err.code, message: err.message },
      });
    }
    if (err instanceof SlugTakenError) {
      c.status(409);
      return c.json({
        data: null,
        error: { status: 409, code: err.code, message: err.message },
      });
    }
    if (err instanceof z.ZodError) {
      c.status(400);
      return c.json({
        data: null,
        error: {
          status: 400,
          code: 'VALIDATION_ERROR',
          message: 'Invalid request',
          details: err.issues.reduce(
            (acc, issue) => {
              const path = issue.path.join('.');
              acc[path] = acc[path] ?? [];
              acc[path].push(issue.message);
              return acc;
            },
            {} as Record<string, string[]>,
          ),
        },
      });
    }
    throw err;
  });

  return app;
}
