import { useCallback, useEffect, useState } from 'react';
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
      const apiUrl =
        (typeof window !== 'undefined' && (window as unknown as Record<string, string>).PUBLIC_API_URL) ??
        'https://api.alzahra.es';

      const res = await fetch(`${apiUrl}/v1/guest/recommendations`, {
        headers: { 'x-guest-token': token },
      });

      if (!res.ok) throw new Error(`Failed to fetch recommendations: ${res.status}`);
      const data = (await res.json()) as { recommendations?: Recommendation[]; data?: Recommendation[] };
      setRecommendations(data.recommendations ?? data.data ?? []);
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
