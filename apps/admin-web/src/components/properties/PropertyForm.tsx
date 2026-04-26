'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateProperty, useUpdateProperty } from '@/hooks/use-properties';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Property, PropertyCategory } from '@alzahra/types';

interface PropertyFormProps {
  propertyId?: string;
  initialData?: Property | undefined;
}

interface FormState {
  name: string;
  slug: string;
  description: string;
  category: PropertyCategory;
  city: string;
  country: string;
  pricePerNight: number | undefined;
  currency: string;
  bedrooms: number | undefined;
  bathrooms: number | undefined;
  maxGuests: number | undefined;
  address: string;
  postalCode: string;
  latitude: number | undefined;
  longitude: number | undefined;
  amenities: string[];
  images: string[];
  ownerId: string;
}

const initialFormState: FormState = {
  name: '',
  slug: '',
  description: '',
  category: 'apartment',
  city: '',
  country: '',
  pricePerNight: undefined,
  currency: 'EUR',
  bedrooms: undefined,
  bathrooms: undefined,
  maxGuests: undefined,
  address: '',
  postalCode: '',
  latitude: undefined,
  longitude: undefined,
  amenities: [],
  images: [],
  ownerId: '',
};

export function PropertyForm({ propertyId, initialData }: PropertyFormProps) {
  const router = useRouter();
  const createMutation = useCreateProperty();
  const updateMutation = useUpdateProperty();
  const [error, setError] = useState('');
  const [form, setForm] = useState<FormState>(initialFormState);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        slug: initialData.slug,
        description: initialData.description ?? '',
        category: initialData.category,
        city: initialData.city ?? '',
        country: initialData.country ?? '',
        pricePerNight: initialData.pricePerNight != null ? Number(initialData.pricePerNight) : undefined,
        currency: initialData.currency,
        bedrooms: initialData.bedrooms ?? undefined,
        bathrooms: initialData.bathrooms != null ? Number(initialData.bathrooms) : undefined,
        maxGuests: initialData.maxGuests ?? undefined,
        address: initialData.address ?? '',
        postalCode: initialData.postalCode ?? '',
        latitude: initialData.latitude != null ? Number(initialData.latitude) : undefined,
        longitude: initialData.longitude != null ? Number(initialData.longitude) : undefined,
        amenities: initialData.amenities ?? [],
        images: initialData.images ?? [],
        ownerId: initialData.ownerId ?? '',
      });
    }
  }, [initialData]);

  const handleChange = (field: keyof FormState, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      if (propertyId) {
        const updateBody: Record<string, unknown> = {};
        if (form.name) updateBody.name = form.name;
        if (form.slug) updateBody.slug = form.slug;
        if (form.description) updateBody.description = form.description;
        if (form.category) updateBody.category = form.category;
        if (form.city) updateBody.city = form.city;
        if (form.country) updateBody.country = form.country;
        if (form.pricePerNight !== undefined) updateBody.pricePerNight = form.pricePerNight;
        if (form.currency) updateBody.currency = form.currency;
        if (form.bedrooms !== undefined) updateBody.bedrooms = form.bedrooms;
        if (form.bathrooms !== undefined) updateBody.bathrooms = form.bathrooms;
        if (form.maxGuests !== undefined) updateBody.maxGuests = form.maxGuests;
        if (form.address) updateBody.address = form.address;
        if (form.postalCode) updateBody.postalCode = form.postalCode;
        if (form.latitude !== undefined) updateBody.latitude = form.latitude;
        if (form.longitude !== undefined) updateBody.longitude = form.longitude;
        if (form.amenities.length > 0) updateBody.amenities = form.amenities;
        if (form.images.length > 0) updateBody.images = form.images;
        if (form.ownerId) updateBody.ownerId = form.ownerId;

        await updateMutation.mutateAsync({ id: propertyId, body: updateBody });
        router.push('/properties');
      } else {
        await createMutation.mutateAsync({
          name: form.name,
          slug: form.slug,
          ...(form.description ? { description: form.description } : {}),
          category: form.category,
          ...(form.city ? { city: form.city } : {}),
          ...(form.country ? { country: form.country } : {}),
          ...(form.pricePerNight !== undefined ? { pricePerNight: form.pricePerNight } : {}),
          currency: form.currency,
          ...(form.bedrooms !== undefined ? { bedrooms: form.bedrooms } : {}),
          ...(form.bathrooms !== undefined ? { bathrooms: form.bathrooms } : {}),
          ...(form.maxGuests !== undefined ? { maxGuests: form.maxGuests } : {}),
          ...(form.address ? { address: form.address } : {}),
          ...(form.postalCode ? { postalCode: form.postalCode } : {}),
          ...(form.latitude !== undefined ? { latitude: form.latitude } : {}),
          ...(form.longitude !== undefined ? { longitude: form.longitude } : {}),
          ...(form.amenities.length > 0 ? { amenities: form.amenities } : {}),
          ...(form.images.length > 0 ? { images: form.images } : {}),
          ...(form.ownerId ? { ownerId: form.ownerId } : {}),
        } as unknown as Parameters<typeof createMutation.mutateAsync>[0]);
        router.push('/properties');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save property');
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Property name"
                required
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                placeholder="property-slug"
                required
                value={form.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Description"
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="City"
                value={form.city}
                onChange={(e) => handleChange('city', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                placeholder="Country"
                value={form.country}
                onChange={(e) => handleChange('country', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price per night</Label>
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                value={form.pricePerNight ?? ''}
                onChange={(e) => handleChange('pricePerNight', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                placeholder="0"
                value={form.bedrooms ?? ''}
                onChange={(e) => handleChange('bedrooms', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                placeholder="0"
                value={form.bathrooms ?? ''}
                onChange={(e) => handleChange('bathrooms', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxGuests">Max guests</Label>
              <Input
                id="maxGuests"
                type="number"
                placeholder="0"
                value={form.maxGuests ?? ''}
                onChange={(e) => handleChange('maxGuests', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : propertyId ? 'Update property' : 'Create property'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
