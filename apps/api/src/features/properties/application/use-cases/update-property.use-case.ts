import type { IPropertyRepository } from '../../domain/repositories/property-repository.interface.js';
import { PropertyNotFoundError } from '../../domain/errors/property-not-found-error.js';
import { SlugTakenError } from '../../domain/errors/slug-taken-error.js';
import type { UpdatePropertyDTO } from '../dto/update-property.dto.js';
import type { Property, UpdatePropertyInput } from '../../domain/entities/property.js';

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

    const updateInput: UpdatePropertyInput = {};
    if (dto.name !== undefined) updateInput.name = dto.name;
    if (dto.slug !== undefined) updateInput.slug = dto.slug;
    if (dto.description !== undefined) updateInput.description = dto.description;
    if (dto.category !== undefined) updateInput.category = dto.category;
    if (dto.status !== undefined) updateInput.status = dto.status;
    if (dto.address !== undefined) updateInput.address = dto.address;
    if (dto.city !== undefined) updateInput.city = dto.city;
    if (dto.country !== undefined) updateInput.country = dto.country;
    if (dto.postalCode !== undefined) updateInput.postalCode = dto.postalCode;
    if (dto.latitude !== undefined) updateInput.latitude = dto.latitude;
    if (dto.longitude !== undefined) updateInput.longitude = dto.longitude;
    if (dto.bedrooms !== undefined) updateInput.bedrooms = dto.bedrooms;
    if (dto.bathrooms !== undefined) updateInput.bathrooms = dto.bathrooms;
    if (dto.maxGuests !== undefined) updateInput.maxGuests = dto.maxGuests;
    if (dto.pricePerNight !== undefined) updateInput.pricePerNight = dto.pricePerNight;
    if (dto.currency !== undefined) updateInput.currency = dto.currency;
    if (dto.amenities !== undefined) updateInput.amenities = dto.amenities;
    if (dto.images !== undefined) updateInput.images = dto.images;
    if (dto.ownerId !== undefined) updateInput.ownerId = dto.ownerId;

    const updated = await this.propertyRepo.update(id, updateInput);

    if (!updated) {
      throw new PropertyNotFoundError();
    }

    return updated;
  }
}
