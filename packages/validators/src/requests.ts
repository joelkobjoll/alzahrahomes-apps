import { z } from 'zod';
import {
  emailSchema,
  paginationSchema,
  uuidSchema,
  userRoleSchema,
  propertyCategorySchema,
  propertyStatusSchema,
  bookingStatusSchema,
  messageTypeSchema,
  eventTypeSchema,
  eventStatusSchema,
  recommendationTypeSchema,
} from './domain.js';

// ============================================================================
// Auth
// ============================================================================

export const loginRequestSchema = z.object({
  email: emailSchema,
  password: z.string().min(8).max(128),
});

export const registerRequestSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(8)
    .max(128)
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  phone: z.string().max(50).optional(),
});

export const refreshTokenRequestSchema = z.object({
  refreshToken: z.string().min(1),
});

// ============================================================================
// Users
// ============================================================================

export const updateUserRequestSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  phone: z.string().max(50).optional(),
  avatarUrl: z.string().url().optional(),
});

export const updateUserRoleRequestSchema = z.object({
  role: userRoleSchema,
});

// ============================================================================
// Properties
// ============================================================================

export const createPropertyRequestSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z
    .string()
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be kebab-case'),
  description: z.string().optional(),
  category: propertyCategorySchema,
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  maxGuests: z.number().int().min(1).optional(),
  pricePerNight: z.number().positive().optional(),
  currency: z.string().length(3).default('EUR'),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string().url()).optional(),
  ownerId: uuidSchema.optional(),
});

export const updatePropertyRequestSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  slug: z
    .string()
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be kebab-case')
    .optional(),
  description: z.string().optional(),
  category: propertyCategorySchema.optional(),
  status: propertyStatusSchema.optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  maxGuests: z.number().int().min(1).optional(),
  pricePerNight: z.number().positive().optional(),
  currency: z.string().length(3).optional(),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string().url()).optional(),
  ownerId: uuidSchema.optional(),
});

export const propertySearchRequestSchema = paginationSchema.extend({
  query: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  category: propertyCategorySchema.optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minGuests: z.coerce.number().int().min(1).optional(),
  status: propertyStatusSchema.optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  radiusKm: z.coerce.number().positive().optional(),
  checkIn: z.string().datetime().optional(),
  checkOut: z.string().datetime().optional(),
});

// ============================================================================
// Bookings
// ============================================================================

export const createBookingRequestSchema = z
  .object({
    propertyId: uuidSchema,
    checkIn: z.string().datetime(),
    checkOut: z.string().datetime(),
    guestCount: z.number().int().min(1).optional(),
    specialRequests: z.string().optional(),
  })
  .refine((data) => new Date(data.checkOut) > new Date(data.checkIn), {
    message: 'Check-out must be after check-in',
    path: ['checkOut'],
  });

export const updateBookingRequestSchema = z
  .object({
    status: bookingStatusSchema.optional(),
    checkIn: z.string().datetime().optional(),
    checkOut: z.string().datetime().optional(),
    guestCount: z.number().int().min(1).optional(),
    specialRequests: z.string().optional(),
    cancellationReason: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.checkIn && data.checkOut) {
        return new Date(data.checkOut) > new Date(data.checkIn);
      }
      return true;
    },
    {
      message: 'Check-out must be after check-in',
      path: ['checkOut'],
    },
  );

export const bookingFilterRequestSchema = paginationSchema.extend({
  propertyId: uuidSchema.optional(),
  guestId: uuidSchema.optional(),
  status: bookingStatusSchema.optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
});

// ============================================================================
// Messages
// ============================================================================

export const createMessageRequestSchema = z.object({
  bookingId: uuidSchema.optional(),
  propertyId: uuidSchema.optional(),
  recipientId: uuidSchema,
  subject: z.string().max(255).optional(),
  body: z.string().min(1),
  type: messageTypeSchema.optional(),
});

export const messageFilterRequestSchema = paginationSchema.extend({
  bookingId: uuidSchema.optional(),
  propertyId: uuidSchema.optional(),
  type: messageTypeSchema.optional(),
  unreadOnly: z.coerce.boolean().optional(),
});

// ============================================================================
// Events
// ============================================================================

export const createEventRequestSchema = z.object({
  propertyId: uuidSchema.optional(),
  bookingId: uuidSchema.optional(),
  type: eventTypeSchema,
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  startAt: z.string().datetime(),
  endAt: z.string().datetime().optional(),
  allDay: z.boolean().optional(),
  assigneeId: uuidSchema.optional(),
});

export const updateEventRequestSchema = z.object({
  type: eventTypeSchema.optional(),
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  startAt: z.string().datetime().optional(),
  endAt: z.string().datetime().optional(),
  allDay: z.boolean().optional(),
  assigneeId: uuidSchema.optional(),
  status: eventStatusSchema.optional(),
});

// ============================================================================
// Feedback
// ============================================================================

export const createFeedbackRequestSchema = z.object({
  bookingId: uuidSchema,
  propertyId: uuidSchema,
  rating: z.number().int().min(1).max(5),
  cleanliness: z.number().int().min(1).max(5).optional(),
  communication: z.number().int().min(1).max(5).optional(),
  location: z.number().int().min(1).max(5).optional(),
  value: z.number().int().min(1).max(5).optional(),
  comment: z.string().optional(),
  isPublic: z.boolean().optional(),
});

export const respondToFeedbackRequestSchema = z.object({
  response: z.string().min(1),
});

// ============================================================================
// Recommendations
// ============================================================================

export const createRecommendationRequestSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  type: recommendationTypeSchema,
  filters: z.record(z.string(), z.unknown()).optional(),
  score: z.number().min(0).max(1).optional(),
  validFrom: z.string().datetime().optional(),
  validUntil: z.string().datetime().optional(),
  propertyIds: z.array(uuidSchema).optional(),
});

// ============================================================================
// Audit Logs
// ============================================================================

export const auditLogFilterRequestSchema = paginationSchema.extend({
  userId: uuidSchema.optional(),
  action: z.string().optional(),
  entityType: z.string().optional(),
  entityId: z.string().optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
});
