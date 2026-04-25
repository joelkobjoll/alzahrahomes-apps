import { useCallback, useEffect, useState } from 'react';
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
      const apiUrl =
        (typeof window !== 'undefined' && (window as unknown as Record<string, string>).PUBLIC_API_URL) ??
        'https://api.alzahra.es';

      const res = await fetch(`${apiUrl}/v1/guest/stay`, {
        headers: { 'x-guest-token': token },
      });

      if (!res.ok) throw new Error(`Failed to fetch property: ${res.status}`);
      const data = (await res.json()) as { property?: Property };
      setProperty(data.property ?? null);
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
