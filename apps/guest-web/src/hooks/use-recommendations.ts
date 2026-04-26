import { useCallback, useEffect, useState } from 'react';
import { api } from '~/lib/api';
import type { Recommendation } from '@alzahra/types/domain';

interface UseRecommendationsResult {
  recommendations: Recommendation[];
  loading: boolean;
  error: string | null;
}

export function useRecommendations(token: string | null): UseRecommendationsResult {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      const result = await api.getRecommendations(token);
      if (result.error) {
        throw new Error(result.error.message);
      }
      setRecommendations(result.data?.recommendations ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return { recommendations, loading, error };
}
