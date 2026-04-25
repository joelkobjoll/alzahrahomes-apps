import type { RecommendationType } from '@alzahra/validators';

export interface Recommendation {
  id: string;
  title: string;
  description: string | null;
  type: RecommendationType;
  filters: Record<string, unknown> | null;
  score: string | null;
  validFrom: Date | null;
  validUntil: Date | null;
  createdAt: Date;
}
