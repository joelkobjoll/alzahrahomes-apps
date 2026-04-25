// ============================================================================
// API contract types — request/response shapes shared across apps
// ============================================================================

import type {
  BookingStatus,
  EventStatus,
  EventType,
  MessageType,
  PropertyCategory,
  PropertyStatus,
  RecommendationType,
  TokenType,
  UserRole,
} from './domain.js';

// ------------------------------------------------------------------
// Pagination
// ------------------------------------------------------------------

export interface PaginatedRequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ------------------------------------------------------------------
// Auth
// ------------------------------------------------------------------

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// ------------------------------------------------------------------
// Users
// ------------------------------------------------------------------

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface UpdateUserRoleRequest {
  role: UserRole;
}

// ------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------

export interface CreatePropertyRequest {
  name: string;
  slug: string;
  description?: string;
  category: PropertyCategory;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  bedrooms?: number;
  bathrooms?: number;
  maxGuests?: number;
  pricePerNight?: number;
  currency?: string;
  amenities?: string[];
  images?: string[];
  ownerId?: string;
}

export interface UpdatePropertyRequest {
  name?: string;
  slug?: string;
  description?: string;
  category?: PropertyCategory;
  status?: PropertyStatus;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  bedrooms?: number;
  bathrooms?: number;
  maxGuests?: number;
  pricePerNight?: number;
  currency?: string;
  amenities?: string[];
  images?: string[];
  ownerId?: string;
}

export interface PropertySearchRequest extends PaginatedRequest {
  query?: string;
  city?: string;
  country?: string;
  category?: PropertyCategory;
  minPrice?: number;
  maxPrice?: number;
  minGuests?: number;
  status?: PropertyStatus;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  checkIn?: string;
  checkOut?: string;
}

// ------------------------------------------------------------------
// Bookings
// ------------------------------------------------------------------

export interface CreateBookingRequest {
  propertyId: string;
  checkIn: string;
  checkOut: string;
  guestCount?: number;
  specialRequests?: string;
}

export interface UpdateBookingRequest {
  status?: BookingStatus;
  checkIn?: string;
  checkOut?: string;
  guestCount?: number;
  specialRequests?: string;
  cancellationReason?: string;
}

export interface BookingFilterRequest extends PaginatedRequest {
  propertyId?: string;
  guestId?: string;
  status?: BookingStatus;
  fromDate?: string;
  toDate?: string;
}

// ------------------------------------------------------------------
// Messages
// ------------------------------------------------------------------

export interface CreateMessageRequest {
  bookingId?: string;
  propertyId?: string;
  recipientId: string;
  subject?: string;
  body: string;
  type?: MessageType;
}

export interface MessageFilterRequest extends PaginatedRequest {
  bookingId?: string;
  propertyId?: string;
  type?: MessageType;
  unreadOnly?: boolean;
}

// ------------------------------------------------------------------
// Events
// ------------------------------------------------------------------

export interface CreateEventRequest {
  propertyId?: string;
  bookingId?: string;
  type: EventType;
  title: string;
  description?: string;
  startAt: string;
  endAt?: string;
  allDay?: boolean;
  assigneeId?: string;
}

export interface UpdateEventRequest {
  type?: EventType;
  title?: string;
  description?: string;
  startAt?: string;
  endAt?: string;
  allDay?: boolean;
  assigneeId?: string;
  status?: EventStatus;
}

// ------------------------------------------------------------------
// Feedback
// ------------------------------------------------------------------

export interface CreateFeedbackRequest {
  bookingId: string;
  propertyId: string;
  rating: number;
  cleanliness?: number;
  communication?: number;
  location?: number;
  value?: number;
  comment?: string;
  isPublic?: boolean;
}

export interface RespondToFeedbackRequest {
  response: string;
}

// ------------------------------------------------------------------
// Recommendations
// ------------------------------------------------------------------

export interface CreateRecommendationRequest {
  title: string;
  description?: string;
  type: RecommendationType;
  filters?: Record<string, unknown>;
  score?: number;
  validFrom?: string;
  validUntil?: string;
  propertyIds?: string[];
}

// ------------------------------------------------------------------
// Audit Logs
// ------------------------------------------------------------------

export interface AuditLogFilterRequest extends PaginatedRequest {
  userId?: string;
  action?: string;
  entityType?: string;
  entityId?: string;
  fromDate?: string;
  toDate?: string;
}

// ------------------------------------------------------------------
// API Error
// ------------------------------------------------------------------

export interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: Record<string, string[]>;
  requestId?: string;
}
