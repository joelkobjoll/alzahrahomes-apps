import { faker } from '@faker-js/faker';
import type { Recommendation, RecommendationType } from '@alzahra/types';

export class RecommendationFactory {
  static create(overrides?: Partial<Recommendation>): Recommendation {
    const now = new Date();
    return {
      id: faker.string.uuid(),
      title: faker.lorem.words(3),
      description: faker.lorem.paragraph(),
      type: faker.helpers.arrayElement<RecommendationType>([
        'manual',
        'ai_generated',
        'trending',
        'seasonal',
      ]),
      filters: null,
      score: faker.number.float({ min: 0, max: 1, fractionDigits: 2 }).toString(),
      validFrom: now,
      validUntil: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      createdAt: now,
      ...overrides,
    };
  }

  static withCategory(category: RecommendationType, overrides?: Partial<Recommendation>): Recommendation {
    return this.create({
      type: category,
      ...overrides,
    });
  }
}
