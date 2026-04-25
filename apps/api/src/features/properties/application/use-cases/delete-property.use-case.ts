import type { IPropertyRepository } from '../../domain/repositories/property-repository.interface.js';
import { PropertyNotFoundError } from '../../domain/errors/property-not-found-error.js';

export class DeletePropertyUseCase {
  constructor(private readonly propertyRepo: IPropertyRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.propertyRepo.findById(id);
    if (!existing) {
      throw new PropertyNotFoundError();
    }

    await this.propertyRepo.delete(id);
  }
}
