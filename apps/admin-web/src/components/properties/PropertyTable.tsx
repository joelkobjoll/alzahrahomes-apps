'use client';

import Link from 'next/link';
import type { Property } from '@alzahra/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface PropertyTableProps {
  data: Property[];
  isLoading: boolean;
}

export function PropertyTable({ data, isLoading }: PropertyTableProps) {
  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-md border border-dashed">
        <p className="text-sm text-muted-foreground">No properties found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Name</th>
            <th className="px-4 py-3 text-left font-medium">Category</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">City</th>
            <th className="px-4 py-3 text-left font-medium">Price/night</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((property) => (
            <tr key={property.id} className="border-t transition-colors hover:bg-muted/50">
              <td className="px-4 py-3 font-medium">{property.name}</td>
              <td className="px-4 py-3 capitalize">{property.category}</td>
              <td className="px-4 py-3">
                <Badge
                  variant={
                    property.status === 'published'
                      ? 'default'
                      : property.status === 'draft'
                      ? 'secondary'
                      : 'outline'
                  }
                >
                  {property.status}
                </Badge>
              </td>
              <td className="px-4 py-3">{property.city ?? '-'}</td>
              <td className="px-4 py-3">
                {property.pricePerNight ? `${property.pricePerNight} ${property.currency}` : '-'}
              </td>
              <td className="px-4 py-3 text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/properties/${property.id}`}>Edit</Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
