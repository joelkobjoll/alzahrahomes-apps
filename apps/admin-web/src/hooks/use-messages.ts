'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Message, MessageFilterRequest } from '@alzahra/types';

interface MessagesListResponse {
  items: Message[];
  total: number;
  page: number;
  limit: number;
}

async function fetchMessages(params?: MessageFilterRequest): Promise<MessagesListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.bookingId) searchParams.set('bookingId', params.bookingId);
  if (params?.propertyId) searchParams.set('propertyId', params.propertyId);
  if (params?.type) searchParams.set('type', params.type);
  if (params?.unreadOnly) searchParams.set('unreadOnly', String(params.unreadOnly));

  const query = searchParams.toString();
  const path = query ? `/messages?${query}` : '/messages';

  return api.get<MessagesListResponse>(path);
}

export function useMessages(params?: MessageFilterRequest) {
  return useQuery({
    queryKey: ['messages', params],
    queryFn: () => fetchMessages(params),
  });
}
