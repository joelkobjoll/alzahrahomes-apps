import type { IPropertyRepository } from '../../domain/repositories/property-repository.interface.js';
import { SlugTakenError } from '../../domain/errors/slug-taken-error.js';
import type { CreatePropertyDTO } from '../dto/create-property.dto.js';
import type { Property } from '../../domain/entities/property.js';

export class CreatePropertyUseCase {
  constructor(private readonly propertyRepo: IPropertyRepository) {}

  async execute(dto: CreatePropertyDTO): Promise<Property> {
    const existing = await this.propertyRepo.findBySlug(dto.slug);
    if (existing) {
      throw new SlugTakenError();
    }

    return this.propertyRepo.create({
      name: dto.name,
      slug: dto.slug,
      description: dto.description ?? null,
      category: dto.category,
      address: dto.address ?? null,
      city: dto.city ?? null,
      country: dto.country ?? null,
      postalCode: dto.postalCode ?? null,
      latitude: dto.latitude ?? null,
      longitude: dto.longitude ?? null,
      bedrooms: dto.bedrooms ?? null,
      bathrooms: dto.bathrooms ?? null,
      maxGuests: dto.maxGuests ?? null,
      pricePerNight: dto.pricePerNight ?? null,
      currency: dto.currency ?? 'EUR',
      amenities: dto.amenities ?? null,
      images: dto.images ?? null,
      ownerId: dto.ownerId ?? null,
    });
  }
}
