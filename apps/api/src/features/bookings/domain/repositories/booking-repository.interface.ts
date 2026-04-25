import type { Booking } from '../entities/booking.js';

export interface IBookingRepository {
  findById(id: string): Promise<Booking | null>;
  findMany(options: {
    limit: number;
    offset: number;
    propertyId?: string;
    guestId?: string;
    status?: string;
    fromDate?: Date;
    toDate?: Date;
  }): Promise<{ items: Booking[]; total: number }>;
  create(input: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'cancelledAt' | 'cancellationReason'>): Promise<Booking>;
  update(id: string, changes: Partial<Omit<Booking, 'id' | 'createdAt'>>): Promise<Booking | null>;
  delete(id: string): Promise<boolean>;
}
