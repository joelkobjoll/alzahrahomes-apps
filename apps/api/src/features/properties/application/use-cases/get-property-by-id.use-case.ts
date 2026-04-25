import type { IPropertyRepository } from '../../domain/repositories/property-repository.interface.js';
import { PropertyNotFoundError } from '../../domain/errors/property-not-found-error.js';
import type { Property } from '../../domain/entities/property.js';

export class GetPropertyByIdUseCase {
  constructor(private readonly propertyRepo: IPropertyRepository) {}

  async execute(id: string): Promise<Property> {
    const property = await this.propertyRepo.findById(id);
    if (!property) {
      throw new PropertyNotFoundError();
    }
    return property;
  }
}
