/**
 * Staff role definitions for the Alzahra Homes platform.
 *
 * guest = unauthenticated or public visitor
 * admin = full system / tenant-level admin
 * owner = property owner
 * staff = general staff member
 */
export const ROLES = [
  'guest',
  'admin',
  'owner',
  'staff',
] as const;

export type Role = (typeof ROLES)[number];

export const STAFF_ROLES: Role[] = [
  'admin',
  'owner',
  'staff',
];

export const ADMIN_ROLES: Role[] = ['admin'];

export function isStaff(role: Role): boolean {
  return STAFF_ROLES.includes(role);
}

export function isAdmin(role: Role): boolean {
  return ADMIN_ROLES.includes(role);
}
