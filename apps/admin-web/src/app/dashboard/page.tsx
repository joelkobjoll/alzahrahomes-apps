'use client';

import { useAuth } from '@/hooks/use-auth';
import { usePermissions } from '@/hooks/use-permissions';
import { useProperties } from '@/hooks/use-properties';
import { useTokens } from '@/hooks/use-tokens';
import { useBookings } from '@/hooks/use-bookings';
import { useMessages } from '@/hooks/use-messages';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { OccupancyChart } from '@/components/charts/OccupancyChart';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, KeyRound, CalendarDays, MessageSquare } from 'lucide-react';

function DashboardContent() {
  const { user } = useAuth();
  const { can } = usePermissions();
  const { data: propertiesData } = useProperties({ limit: 1 });
  const { data: tokensData } = useTokens();
  const { data: bookingsData } = useBookings({ limit: 1 });
  const { data: messagesData } = useMessages({ limit: 1 });

  const propertyCount = propertiesData?.total ?? 0;
  const tokenCount = tokensData?.total ?? 0;
  const bookingCount = bookingsData?.total ?? 0;
  const messageCount = messagesData?.total ?? 0;

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar className="hidden lg:flex" />
      <div className="flex flex-1 flex-col">
        <Header />
        <MobileNav />
        <main className="flex-1 p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.firstName ?? 'Admin'}.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Properties</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{propertyCount}</div>
                <p className="text-xs text-muted-foreground">
                  {propertyCount > 0 ? 'Active listings' : 'No properties yet'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Tokens</CardTitle>
                <KeyRound className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tokenCount}</div>
                <p className="text-xs text-muted-foreground">
                  {tokenCount > 0 ? 'Total tokens issued' : 'No tokens yet'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Bookings</CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{bookingCount}</div>
                <p className="text-xs text-muted-foreground">
                  {bookingCount > 0 ? 'Total reservations' : 'No bookings yet'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{messageCount}</div>
                <p className="text-xs text-muted-foreground">
                  {messageCount > 0 ? 'Total messages' : 'No messages yet'}
                </p>
              </CardContent>
            </Card>
          </div>

          {can('view', 'analytics') && (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Occupancy</CardTitle>
                  <CardDescription>Monthly occupancy rate across all properties</CardDescription>
                </CardHeader>
                <CardContent>
                  <OccupancyChart />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Revenue</CardTitle>
                  <CardDescription>Monthly revenue in EUR</CardDescription>
                </CardHeader>
                <CardContent>
                  <RevenueChart />
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
