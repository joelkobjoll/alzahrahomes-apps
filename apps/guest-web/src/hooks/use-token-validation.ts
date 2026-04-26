import { useCallback, useEffect, useState } from 'react';
import { api } from '~/lib/api';

interface UseTokenValidationResult {
  valid: boolean;
  loading: boolean;
  error: string | null;
}

export function useTokenValidation(token: string | null): UseTokenValidationResult {
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback(async () => {
    if (!token) {
      setValid(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await api.validateToken(token);
      setValid(result.data?.valid ?? false);
      if (!result.data?.valid || result.error) {
        setError(result.error?.message ?? 'Invalid or expired token');
      }
    } catch (err) {
      setValid(false);
      setError(err instanceof Error ? err.message : 'Validation failed');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    validate();
  }, [validate]);

  return { valid, loading, error };
}
