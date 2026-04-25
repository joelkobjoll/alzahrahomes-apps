import {
  ROLE_PERMISSIONS,
  type Role,
  type Permission,
} from '@alzahra/auth-config';

/**
 * Check if a role has a specific permission.
 */
export function can(role: Role, permission: Permission): boolean {
  const perms = ROLE_PERMISSIONS[role] ?? [];
  return perms.includes(permission);
}

/**
 * Check if a role has ALL of the given permissions.
 */
export function canAll(role: Role, permissions: Permission[]): boolean {
  return permissions.every((p) => can(role, p));
}

/**
 * Check if a role has ANY of the given permissions.
 */
export function canAny(role: Role, permissions: Permission[]): boolean {
  return permissions.some((p) => can(role, p));
}

/**
 * Return the list of permissions for a role.
 */
export function permissionsFor(role: Role): Permission[] {
  return [...(ROLE_PERMISSIONS[role] ?? [])];
}

/**
 * Throw if the role lacks the required permission.
 */
export function requireAuth(role: Role, permission: Permission): void {
  if (!can(role, permission)) {
    throw new PermissionDeniedError(role, permission);
  }
}

export class PermissionDeniedError extends Error {
  constructor(
    public readonly role: Role,
    public readonly permission: Permission,
  ) {
    super(`Role "${role}" does not have permission "${permission}"`);
    this.name = 'PermissionDeniedError';
  }
}
