// ============================================================================
// Domain entity types — mirrors the Drizzle schema but as plain TS interfaces
// ============================================================================

export type UserRole = 'guest' | 'admin' | 'owner' | 'staff';

export interface User {
  id: string;
  email: string;
  passwordHash: string | null;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: UserRole;
  avatarUrl: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
}

export type PropertyStatus = 'draft' | 'published' | 'archived';

export type PropertyCategory =
  | 'apartment'
  | 'villa'
  | 'house'
  | 'studio'
  | 'penthouse'
  | 'townhouse'
  | 'bungalow'
  | 'cottage'
  | 'other';

export interface Property {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: PropertyCategory;
  status: PropertyStatus;
  address: string | null;
  city: string | null;
  country: string | null;
  postalCode: string | null;
  latitude: string | null;
  longitude: string | null;
  /** PostGIS geometry — serialized as GeoJSON or WKT */
  geom: unknown | null;
  bedrooms: number | null;
  bathrooms: string | null;
  maxGuests: number | null;
  pricePerNight: string | null;
  currency: string;
  amenities: string[] | null;
  images: string[] | null;
  ownerId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type TokenType = 'api' | 'refresh' | 'reset_password' | 'verify_email';

export interface Token {
  id: string;
  userId: string;
  type: TokenType;
  tokenHash: string;
  expiresAt: Date | null;
  lastUsedAt: Date | null;
  createdAt: Date;
  revokedAt: Date | null;
  metadata: Record<string, unknown> | null;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';

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

export type MessageType = 'inquiry' | 'booking' | 'support' | 'notification' | 'system';

export interface Message {
  id: string;
  bookingId: string | null;
  propertyId: string | null;
  senderId: string;
  recipientId: string;
  subject: string | null;
  body: string;
  type: MessageType;
  readAt: Date | null;
  createdAt: Date;
}

export type EventType = 'check_in' | 'check_out' | 'maintenance' | 'cleaning' | 'inspection' | 'other';

export type EventStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface Event {
  id: string;
  propertyId: string | null;
  bookingId: string | null;
  type: EventType;
  title: string;
  description: string | null;
  startAt: Date;
  endAt: Date | null;
  allDay: boolean;
  assigneeId: string | null;
  status: EventStatus;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Feedback {
  id: string;
  bookingId: string;
  propertyId: string;
  userId: string;
  rating: number;
  cleanliness: number | null;
  communication: number | null;
  location: number | null;
  value: number | null;
  comment: string | null;
  isPublic: boolean;
  response: string | null;
  respondedAt: Date | null;
  createdAt: Date;
}

export type RecommendationType = 'manual' | 'ai_generated' | 'trending' | 'seasonal';

export interface Recommendation {
  id: string;
  title: string;
  description: string | null;
  type: RecommendationType;
  filters: Record<string, unknown> | null;
  score: string | null;
  validFrom: Date | null;
  validUntil: Date | null;
  createdAt: Date;
}

export interface PropertyRec {
  propertyId: string;
  recommendationId: string;
  rank: number;
  reason: string | null;
  createdAt: Date;
}

export interface AuditLog {
  id: string;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
}
