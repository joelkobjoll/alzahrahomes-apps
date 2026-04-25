'use client';

import { useParams } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { PropertyForm } from '@/components/properties/PropertyForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar className="hidden lg:flex" />
      <div className="flex flex-1 flex-col">
        <Header />
        <MobileNav />
        <main className="flex-1 p-4 md:p-6">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link href="/properties">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to properties
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Edit Property</h1>
            <p className="text-muted-foreground">ID: {id}</p>
          </div>
          <PropertyForm propertyId={id} />
        </main>
      </div>
    </div>
  );
}
