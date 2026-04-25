/**
 * Staff role definitions for the Alzahra Homes platform.
 *
 * guest = unauthenticated or public visitor
 * super_admin = full system access
 * admin = tenant-level admin
 * property_manager = manages assigned properties
 * operations = bookings, events, logistics
 * support = read-mostly, handles guest inquiries
 */
export const ROLES = [
  'guest',
  'super_admin',
  'admin',
  'property_manager',
  'operations',
  'support',
] as const;

export type Role = (typeof ROLES)[number];

export const STAFF_ROLES: Role[] = [
  'super_admin',
  'admin',
  'property_manager',
  'operations',
  'support',
];

export const ADMIN_ROLES: Role[] = ['super_admin', 'admin'];

export function isStaff(role: Role): boolean {
  return STAFF_ROLES.includes(role);
}

export function isAdmin(role: Role): boolean {
  return ADMIN_ROLES.includes(role);
}
