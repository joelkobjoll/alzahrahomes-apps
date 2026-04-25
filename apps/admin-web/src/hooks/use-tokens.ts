'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { Token } from '@alzahra/types';

async function fetchTokens(): Promise<Token[]> {
  const res = await apiClient.get('/tokens');
  if (!res.ok) throw new Error('Failed to fetch tokens');
  const data = (await res.json()) as { data: Token[] };
  return data.data ?? [];
}

export function useTokens() {
  return useQuery({
    queryKey: ['tokens'],
    queryFn: fetchTokens,
  });
}
