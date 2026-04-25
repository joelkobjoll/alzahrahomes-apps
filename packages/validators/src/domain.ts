import { z } from 'zod';

// ============================================================================
// Shared primitives
// ============================================================================

export const uuidSchema = z.string().uuid();

export const emailSchema = z.string().email().max(255);

export const phoneSchema = z.string().max(50).optional();

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ============================================================================
// Enums
// ============================================================================

export const userRoleSchema = z.enum(['guest', 'admin', 'owner', 'staff']);

export const propertyStatusSchema = z.enum(['draft', 'published', 'archived']);

export const propertyCategorySchema = z.enum([
  'apartment',
  'villa',
  'house',
  'studio',
  'penthouse',
  'townhouse',
  'bungalow',
  'cottage',
  'other',
]);

export const tokenTypeSchema = z.enum(['api', 'refresh', 'reset_password', 'verify_email']);

export const bookingStatusSchema = z.enum([
  'pending',
  'confirmed',
  'cancelled',
  'completed',
  'no_show',
]);

export const messageTypeSchema = z.enum(['inquiry', 'booking', 'support', 'notification', 'system']);

export const eventTypeSchema = z.enum([
  'check_in',
  'check_out',
  'maintenance',
  'cleaning',
  'inspection',
  'other',
]);

export const eventStatusSchema = z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']);

export const recommendationTypeSchema = z.enum([
  'manual',
  'ai_generated',
  'trending',
  'seasonal',
]);

// ============================================================================
// Domain entities
// ============================================================================

export const userSchema = z.object({
  id: uuidSchema,
  email: emailSchema,
  passwordHash: z.string().max(255).nullable(),
  firstName: z.string().max(100),
  lastName: z.string().max(100),
  phone: z.string().max(50).nullable(),
  role: userRoleSchema,
  avatarUrl: z.string().url().nullable(),
  emailVerified: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});

export const sessionSchema = z.object({
  id: uuidSchema,
  userId: uuidSchema,
  token: z.string().max(255),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date(),
  ipAddress: z.string().max(45).nullable(),
  userAgent: z.string().nullable(),
});

export const propertySchema = z.object({
  id: uuidSchema,
  name: z.string().max(255),
  slug: z.string().max(255),
  description: z.string().nullable(),
  category: propertyCategorySchema,
  status: propertyStatusSchema,
  address: z.string().max(500).nullable(),
  city: z.string().max(100).nullable(),
  country: z.string().max(100).nullable(),
  postalCode: z.string().max(20).nullable(),
  latitude: z.string().nullable(),
  longitude: z.string().nullable(),
  geom: z.unknown().nullable(),
  bedrooms: z.number().int().nullable(),
  bathrooms: z.string().nullable(),
  maxGuests: z.number().int().nullable(),
  pricePerNight: z.string().nullable(),
  currency: z.string().length(3).default('EUR'),
  amenities: z.array(z.string()).nullable(),
  images: z.array(z.string()).nullable(),
  ownerId: uuidSchema.nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const tokenSchema = z.object({
  id: uuidSchema,
  userId: uuidSchema,
  type: tokenTypeSchema,
  tokenHash: z.string().max(255),
  expiresAt: z.coerce.date().nullable(),
  lastUsedAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  revokedAt: z.coerce.date().nullable(),
  metadata: z.record(z.unknown()).nullable(),
});

export const bookingSchema = z.object({
  id: uuidSchema,
  propertyId: uuidSchema,
  guestId: uuidSchema,
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
  status: bookingStatusSchema,
  totalPrice: z.string().nullable(),
  currency: z.string().length(3).default('EUR'),
  guestCount: z.number().int().min(1).default(1),
  specialRequests: z.string().nullable(),
  metadata: z.record(z.unknown()).nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  cancelledAt: z.coerce.date().nullable(),
  cancellationReason: z.string().nullable(),
});

export const messageSchema = z.object({
  id: uuidSchema,
  bookingId: uuidSchema.nullable(),
  propertyId: uuidSchema.nullable(),
  senderId: uuidSchema,
  recipientId: uuidSchema,
  subject: z.string().max(255).nullable(),
  body: z.string().min(1),
  type: messageTypeSchema,
  readAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
});

export const eventSchema = z.object({
  id: uuidSchema,
  propertyId: uuidSchema.nullable(),
  bookingId: uuidSchema.nullable(),
  type: eventTypeSchema,
  title: z.string().max(255),
  description: z.string().nullable(),
  startAt: z.coerce.date(),
  endAt: z.coerce.date().nullable(),
  allDay: z.boolean().default(false),
  assigneeId: uuidSchema.nullable(),
  status: eventStatusSchema,
  metadata: z.record(z.unknown()).nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const feedbackSchema = z.object({
  id: uuidSchema,
  bookingId: uuidSchema,
  propertyId: uuidSchema,
  userId: uuidSchema,
  rating: z.number().int().min(1).max(5),
  cleanliness: z.number().int().min(1).max(5).nullable(),
  communication: z.number().int().min(1).max(5).nullable(),
  location: z.number().int().min(1).max(5).nullable(),
  value: z.number().int().min(1).max(5).nullable(),
  comment: z.string().nullable(),
  isPublic: z.boolean().default(false),
  response: z.string().nullable(),
  respondedAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
});

export const recommendationSchema = z.object({
  id: uuidSchema,
  title: z.string().max(255),
  description: z.string().nullable(),
  type: recommendationTypeSchema,
  filters: z.record(z.unknown()).nullable(),
  score: z.string().nullable(),
  validFrom: z.coerce.date().nullable(),
  validUntil: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
});

export const propertyRecSchema = z.object({
  propertyId: uuidSchema,
  recommendationId: uuidSchema,
  rank: z.number().int().default(0),
  reason: z.string().nullable(),
  createdAt: z.coerce.date(),
});

export const auditLogSchema = z.object({
  id: uuidSchema,
  userId: uuidSchema.nullable(),
  action: z.string().max(100),
  entityType: z.string().max(100),
  entityId: z.string().max(100).nullable(),
  metadata: z.record(z.unknown()).nullable(),
  ipAddress: z.string().max(45).nullable(),
  userAgent: z.string().nullable(),
  createdAt: z.coerce.date(),
});
