import { useCallback, useEffect, useState } from 'react';
import { api } from '~/lib/api';
import type { Property } from '@alzahra/types/domain';

interface UsePropertyResult {
  property: Property | null;
  loading: boolean;
  error: string | null;
}

export function useProperty(token: string | null): UsePropertyResult {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProperty = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      const result = await api.getStay(token);
      if (result.error) {
        throw new Error(result.error.message);
      }
      setProperty(result.data?.property ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  return { property, loading, error };
}
