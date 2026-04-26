/**
 * Permission constants for the Alzahra Homes platform.
 *
 * Permissions are strings in the format `resource:action`.
 * Use `can(role, permission)` from @alzahra/auth-client to check authorization.
 */

// Users
export const PERMISSION_MANAGE_USERS = 'users:manage';
export const PERMISSION_VIEW_USERS = 'users:view';

// Properties
export const PERMISSION_MANAGE_PROPERTIES = 'properties:manage';
export const PERMISSION_VIEW_PROPERTIES = 'properties:view';

// Bookings
export const PERMISSION_MANAGE_BOOKINGS = 'bookings:manage';
export const PERMISSION_VIEW_BOOKINGS = 'bookings:view';

// Events
export const PERMISSION_MANAGE_EVENTS = 'events:manage';
export const PERMISSION_VIEW_EVENTS = 'events:view';

// Messages
export const PERMISSION_MANAGE_MESSAGES = 'messages:manage';
export const PERMISSION_VIEW_MESSAGES = 'messages:view';

// Feedback
export const PERMISSION_MANAGE_FEEDBACK = 'feedback:manage';
export const PERMISSION_VIEW_FEEDBACK = 'feedback:view';

// Recommendations
export const PERMISSION_MANAGE_RECOMMENDATIONS = 'recommendations:manage';
export const PERMISSION_VIEW_RECOMMENDATIONS = 'recommendations:view';

// Audit Logs
export const PERMISSION_VIEW_AUDIT_LOGS = 'audit_logs:view';

// Settings
export const PERMISSION_MANAGE_SETTINGS = 'settings:manage';

// Impersonation
export const PERMISSION_IMPERSONATE = 'auth:impersonate';

// All permissions array for iteration / UI usage
export const ALL_PERMISSIONS = [
  PERMISSION_MANAGE_USERS,
  PERMISSION_VIEW_USERS,
  PERMISSION_MANAGE_PROPERTIES,
  PERMISSION_VIEW_PROPERTIES,
  PERMISSION_MANAGE_BOOKINGS,
  PERMISSION_VIEW_BOOKINGS,
  PERMISSION_MANAGE_EVENTS,
  PERMISSION_VIEW_EVENTS,
  PERMISSION_MANAGE_MESSAGES,
  PERMISSION_VIEW_MESSAGES,
  PERMISSION_MANAGE_FEEDBACK,
  PERMISSION_VIEW_FEEDBACK,
  PERMISSION_MANAGE_RECOMMENDATIONS,
  PERMISSION_VIEW_RECOMMENDATIONS,
  PERMISSION_VIEW_AUDIT_LOGS,
  PERMISSION_MANAGE_SETTINGS,
  PERMISSION_IMPERSONATE,
] as const;

export type Permission = (typeof ALL_PERMISSIONS)[number];

/**
 * Role-based permission matrix.
 */
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  admin: [...ALL_PERMISSIONS],
  owner: [
    PERMISSION_VIEW_USERS,
    PERMISSION_MANAGE_PROPERTIES,
    PERMISSION_VIEW_PROPERTIES,
    PERMISSION_MANAGE_BOOKINGS,
    PERMISSION_VIEW_BOOKINGS,
    PERMISSION_MANAGE_EVENTS,
    PERMISSION_VIEW_EVENTS,
    PERMISSION_MANAGE_MESSAGES,
    PERMISSION_VIEW_MESSAGES,
    PERMISSION_MANAGE_FEEDBACK,
    PERMISSION_VIEW_FEEDBACK,
  ],
  staff: [
    PERMISSION_VIEW_PROPERTIES,
    PERMISSION_VIEW_BOOKINGS,
    PERMISSION_MANAGE_BOOKINGS,
    PERMISSION_MANAGE_EVENTS,
    PERMISSION_VIEW_EVENTS,
    PERMISSION_MANAGE_MESSAGES,
    PERMISSION_VIEW_MESSAGES,
    PERMISSION_VIEW_FEEDBACK,
    PERMISSION_VIEW_USERS,
    PERMISSION_VIEW_AUDIT_LOGS,
  ],
  guest: [],
};
