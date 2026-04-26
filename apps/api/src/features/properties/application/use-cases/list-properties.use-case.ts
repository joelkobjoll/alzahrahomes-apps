import type { IPropertyRepository } from '../../domain/repositories/property-repository.interface.js';
import type { PropertyListDTO } from '../dto/property-list.dto.js';

export interface ListPropertiesInput {
  page: number;
  limit: number;
  city?: string | undefined;
  country?: string | undefined;
  category?: string | undefined;
  status?: string | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  minGuests?: number | undefined;
}

export class ListPropertiesUseCase {
  constructor(private readonly propertyRepo: IPropertyRepository) {}

  async execute(input: ListPropertiesInput): Promise<PropertyListDTO> {
    const { items, total } = await this.propertyRepo.findMany({
      limit: input.limit,
      offset: (input.page - 1) * input.limit,
      city: input.city,
      country: input.country,
      category: input.category,
      status: input.status,
      minPrice: input.minPrice,
      maxPrice: input.maxPrice,
      minGuests: input.minGuests,
    });

    return {
      items,
      total,
      page: input.page,
      limit: input.limit,
    };
  }
}
