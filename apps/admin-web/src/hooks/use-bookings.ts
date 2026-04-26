'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Booking, BookingFilterRequest } from '@alzahra/types';

interface BookingsListResponse {
  items: Booking[];
  total: number;
  page: number;
  limit: number;
}

async function fetchBookings(params?: BookingFilterRequest): Promise<BookingsListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.propertyId) searchParams.set('propertyId', params.propertyId);
  if (params?.guestId) searchParams.set('guestId', params.guestId);
  if (params?.status) searchParams.set('status', params.status);
  if (params?.fromDate) searchParams.set('fromDate', params.fromDate);
  if (params?.toDate) searchParams.set('toDate', params.toDate);

  const query = searchParams.toString();
  const path = query ? `/bookings?${query}` : '/bookings';

  return api.get<BookingsListResponse>(path);
}

export function useBookings(params?: BookingFilterRequest) {
  return useQuery({
    queryKey: ['bookings', params],
    queryFn: () => fetchBookings(params),
  });
}
