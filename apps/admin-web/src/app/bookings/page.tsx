'use client';

import { useBookings } from '@/hooks/use-bookings';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

function BookingsContent() {
  const { data, isLoading } = useBookings({ limit: 50 });

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar className="hidden lg:flex" />
      <div className="flex flex-1 flex-col">
        <Header />
        <MobileNav />
        <main className="flex-1 p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
            <p className="text-muted-foreground">Manage reservations and check-ins</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>All Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex h-48 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : data && data.items.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium">Property</th>
                        <th className="px-4 py-3 text-left font-medium">Check-in</th>
                        <th className="px-4 py-3 text-left font-medium">Check-out</th>
                        <th className="px-4 py-3 text-left font-medium">Status</th>
                        <th className="px-4 py-3 text-left font-medium">Guests</th>
                        <th className="px-4 py-3 text-right font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.items.map((booking) => (
                        <tr key={booking.id} className="border-t transition-colors hover:bg-muted/50">
                          <td className="px-4 py-3">{booking.propertyId}</td>
                          <td className="px-4 py-3">
                            {booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-4 py-3">
                            {booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              variant={
                                booking.status === 'confirmed'
                                  ? 'default'
                                  : booking.status === 'pending'
                                  ? 'secondary'
                                  : 'destructive'
                              }
                            >
                              {booking.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">{booking.guestCount}</td>
                          <td className="px-4 py-3 text-right">
                            {booking.totalPrice ? `${booking.totalPrice} ${booking.currency}` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No bookings found.</p>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

export default function BookingsPage() {
  return (
    <AuthGuard>
      <BookingsContent />
    </AuthGuard>
  );
}
