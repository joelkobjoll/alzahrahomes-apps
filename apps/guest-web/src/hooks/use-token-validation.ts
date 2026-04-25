import { useCallback, useEffect, useState } from 'react';

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
      const apiUrl =
        (typeof window !== 'undefined' && (window as unknown as Record<string, string>).PUBLIC_API_URL) ??
        'https://api.alzahra.es';

      const res = await fetch(`${apiUrl}/v1/guest/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-guest-token': token,
        },
        body: JSON.stringify({ token }),
      });

      setValid(res.ok);
      if (!res.ok) {
        setError('Invalid or expired token');
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
