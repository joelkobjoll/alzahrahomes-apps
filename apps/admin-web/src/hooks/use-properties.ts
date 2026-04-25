'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { Property } from '@alzahra/types';

async function fetchProperties(): Promise<Property[]> {
  const res = await apiClient.get('/properties');
  if (!res.ok) throw new Error('Failed to fetch properties');
  const data = (await res.json()) as { data: Property[] };
  return data.data ?? [];
}

export function useProperties() {
  return useQuery({
    queryKey: ['properties'],
    queryFn: fetchProperties,
  });
}
