'use client';

import { useProperties } from '@/hooks/use-properties';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { PropertyTable } from '@/components/properties/PropertyTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function PropertiesPage() {
  const { data: properties, isLoading } = useProperties();

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar className="hidden lg:flex" />
      <div className="flex flex-1 flex-col">
        <Header />
        <MobileNav />
        <main className="flex-1 p-4 md:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Properties</h1>
              <p className="text-muted-foreground">Manage your property listings</p>
            </div>
            <Button asChild>
              <Link href="/properties/new">
                <Plus className="mr-2 h-4 w-4" />
                Add property
              </Link>
            </Button>
          </div>
          <PropertyTable data={properties ?? []} isLoading={isLoading} />
        </main>
      </div>
    </div>
  );
}
