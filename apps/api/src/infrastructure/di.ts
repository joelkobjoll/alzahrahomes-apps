import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@alzahra/db/schema';
import { DrizzlePropertyRepository } from '../features/properties/infrastructure/repositories/drizzle-property.repository.js';
import { DrizzleTokenRepository } from '../features/tokens/infrastructure/repositories/drizzle-token.repository.js';
import { DrizzleRecommendationRepository } from '../features/recommendations/infrastructure/repositories/drizzle-recommendation.repository.js';
import { DrizzleBookingRepository } from '../features/bookings/infrastructure/repositories/drizzle-booking.repository.js';
import { CreatePropertyUseCase } from '../features/properties/application/use-cases/create-property.use-case.js';
import { GetPropertyByIdUseCase } from '../features/properties/application/use-cases/get-property-by-id.use-case.js';
import { ListPropertiesUseCase } from '../features/properties/application/use-cases/list-properties.use-case.js';
import { UpdatePropertyUseCase } from '../features/properties/application/use-cases/update-property.use-case.js';
import { DeletePropertyUseCase } from '../features/properties/application/use-cases/delete-property.use-case.js';
import { GenerateTokenUseCase } from '../features/tokens/application/use-cases/generate-token.use-case.js';
import { ValidateTokenUseCase } from '../features/tokens/application/use-cases/validate-token.use-case.js';
import { RevokeTokenUseCase } from '../features/tokens/application/use-cases/revoke-token.use-case.js';
import { ExtendTokenUseCase } from '../features/tokens/application/use-cases/extend-token.use-case.js';

export interface DIContainer {
  createPropertyUseCase: CreatePropertyUseCase;
  getPropertyByIdUseCase: GetPropertyByIdUseCase;
  listPropertiesUseCase: ListPropertiesUseCase;
  updatePropertyUseCase: UpdatePropertyUseCase;
  deletePropertyUseCase: DeletePropertyUseCase;
  generateTokenUseCase: GenerateTokenUseCase;
  validateTokenUseCase: ValidateTokenUseCase;
  revokeTokenUseCase: RevokeTokenUseCase;
  extendTokenUseCase: ExtendTokenUseCase;
}

import { createHash } from 'node:crypto';

class Sha256TokenHasher {
  hash(plain: string): string {
    return createHash('sha256').update(plain).digest('hex');
  }
}

class RandomTokenGenerator {
  generate(): string {
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
}

export function createDIContainer(databaseUrl: string): DIContainer {
  const client = postgres(databaseUrl, { prepare: false });
  const db = drizzle(client, { schema });

  const propertyRepo = new DrizzlePropertyRepository(db);
  const tokenRepo = new DrizzleTokenRepository(db);
  const tokenHasher = new Sha256TokenHasher();
  const tokenGenerator = new RandomTokenGenerator();

  return {
    createPropertyUseCase: new CreatePropertyUseCase(propertyRepo),
    getPropertyByIdUseCase: new GetPropertyByIdUseCase(propertyRepo),
    listPropertiesUseCase: new ListPropertiesUseCase(propertyRepo),
    updatePropertyUseCase: new UpdatePropertyUseCase(propertyRepo),
    deletePropertyUseCase: new DeletePropertyUseCase(propertyRepo),
    generateTokenUseCase: new GenerateTokenUseCase(tokenRepo, tokenHasher, tokenGenerator),
    validateTokenUseCase: new ValidateTokenUseCase(tokenRepo, tokenHasher),
    revokeTokenUseCase: new RevokeTokenUseCase(tokenRepo),
    extendTokenUseCase: new ExtendTokenUseCase(tokenRepo),
  };
}
