import type { IPropertyRepository } from '../../domain/repositories/property-repository.interface.js';
import { PropertyNotFoundError } from '../../domain/errors/property-not-found-error.js';
import { SlugTakenError } from '../../domain/errors/slug-taken-error.js';
import type { UpdatePropertyDTO } from '../dto/update-property.dto.js';
import type { Property } from '../../domain/entities/property.js';

export class UpdatePropertyUseCase {
  constructor(private readonly propertyRepo: IPropertyRepository) {}

  async execute(id: string, dto: UpdatePropertyDTO): Promise<Property> {
    const existing = await this.propertyRepo.findById(id);
    if (!existing) {
      throw new PropertyNotFoundError();
    }

    if (dto.slug && dto.slug !== existing.slug) {
      const slugTaken = await this.propertyRepo.findBySlug(dto.slug);
      if (slugTaken) {
        throw new SlugTakenError();
      }
    }

    const updated = await this.propertyRepo.update(id, {
      ...dto,
      bathrooms: dto.bathrooms != null ? String(dto.bathrooms) : dto.bathrooms,
      pricePerNight: dto.pricePerNight != null ? String(dto.pricePerNight) : dto.pricePerNight,
    });

    if (!updated) {
      throw new PropertyNotFoundError();
    }

    return updated;
  }
}
