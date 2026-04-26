export * from './domain.js';
export * from './requests.js';

import type { propertyCategorySchema, propertyStatusSchema, bookingStatusSchema, tokenTypeSchema, recommendationTypeSchema } from './domain.js';
import type { z } from 'zod';

export type PropertyCategory = z.infer<typeof propertyCategorySchema>;
export type PropertyStatus = z.infer<typeof propertyStatusSchema>;
export type BookingStatus = z.infer<typeof bookingStatusSchema>;
export type TokenType = z.infer<typeof tokenTypeSchema>;
export type RecommendationType = z.infer<typeof recommendationTypeSchema>;
