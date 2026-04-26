'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type {
  Property,
  CreatePropertyRequest,
  UpdatePropertyRequest,
  PropertySearchRequest,
} from '@alzahra/types';

interface PropertiesListResponse {
  items: Property[];
  total: number;
}

async function fetchProperties(params?: PropertySearchRequest): Promise<PropertiesListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.city) searchParams.set('city', params.city);
  if (params?.country) searchParams.set('country', params.country);
  if (params?.category) searchParams.set('category', params.category);
  if (params?.status) searchParams.set('status', params.status);
  if (params?.minPrice != null) searchParams.set('minPrice', String(params.minPrice));
  if (params?.maxPrice != null) searchParams.set('maxPrice', String(params.maxPrice));
  if (params?.minGuests != null) searchParams.set('minGuests', String(params.minGuests));

  const query = searchParams.toString();
  const path = query ? `/properties?${query}` : '/properties';

  return api.get<PropertiesListResponse>(path);
}

async function fetchPropertyById(id: string): Promise<Property> {
  return api.get<Property>(`/properties/${id}`);
}

async function createProperty(body: CreatePropertyRequest): Promise<Property> {
  return api.post<Property>('/properties', body);
}

async function updateProperty({ id, body }: { id: string; body: UpdatePropertyRequest }): Promise<Property> {
  return api.patch<Property>(`/properties/${id}`, body);
}

async function deleteProperty(id: string): Promise<null> {
  return api.delete<null>(`/properties/${id}`);
}

export function useProperties(params?: PropertySearchRequest) {
  return useQuery({
    queryKey: ['properties', params],
    queryFn: () => fetchProperties(params),
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => fetchPropertyById(id),
    enabled: !!id,
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProperty,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', variables.id] });
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}
