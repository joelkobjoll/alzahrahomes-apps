import type { BookingStatus } from '@alzahra/validators';

export interface Booking {
  id: string;
  propertyId: string;
  guestId: string;
  checkIn: Date;
  checkOut: Date;
  status: BookingStatus;
  totalPrice: string | null;
  currency: string;
  guestCount: number;
  specialRequests: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
  cancelledAt: Date | null;
  cancellationReason: string | null;
}
