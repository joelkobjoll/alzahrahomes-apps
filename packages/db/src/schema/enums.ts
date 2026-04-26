import { pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['guest', 'admin', 'owner', 'staff']);
export type UserRole = typeof userRoleEnum.enumValues[number];

export const propertyStatusEnum = pgEnum('property_status', ['draft', 'published', 'archived']);
export type PropertyStatus = typeof propertyStatusEnum.enumValues[number];

export const propertyCategoryEnum = pgEnum('property_category', [
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
export type PropertyCategory = typeof propertyCategoryEnum.enumValues[number];

export const tokenTypeEnum = pgEnum('token_type', [
  'api',
  'refresh',
  'reset_password',
  'verify_email',
]);
export type TokenType = typeof tokenTypeEnum.enumValues[number];

export const bookingStatusEnum = pgEnum('booking_status', [
  'pending',
  'confirmed',
  'cancelled',
  'completed',
  'no_show',
]);
export type BookingStatus = typeof bookingStatusEnum.enumValues[number];

export const messageTypeEnum = pgEnum('message_type', [
  'inquiry',
  'booking',
  'support',
  'notification',
  'system',
]);

export const eventTypeEnum = pgEnum('event_type', [
  'check_in',
  'check_out',
  'maintenance',
  'cleaning',
  'inspection',
  'other',
]);

export const eventStatusEnum = pgEnum('event_status', [
  'scheduled',
  'in_progress',
  'completed',
  'cancelled',
]);

export const recommendationTypeEnum = pgEnum('recommendation_type', [
  'manual',
  'ai_generated',
  'trending',
  'seasonal',
]);
export type RecommendationType = typeof recommendationTypeEnum.enumValues[number];
