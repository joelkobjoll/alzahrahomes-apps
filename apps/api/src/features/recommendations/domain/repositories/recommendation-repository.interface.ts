import type { Recommendation } from '../entities/recommendation.js';

export interface IRecommendationRepository {
  findById(id: string): Promise<Recommendation | null>;
  findMany(options: { limit: number; offset: number }): Promise<{ items: Recommendation[]; total: number }>;
  create(input: Omit<Recommendation, 'id' | 'createdAt'>): Promise<Recommendation>;
  update(id: string, changes: Partial<Omit<Recommendation, 'id' | 'createdAt'>>): Promise<Recommendation | null>;
  delete(id: string): Promise<boolean>;
}
