'use client';

import { useAuth } from './use-auth';

type Resource = 'properties' | 'tokens' | 'bookings' | 'users' | 'messages' | 'analytics' | 'settings';
type Action = 'view' | 'create' | 'edit' | 'delete' | 'manage';

const ROLE_PERMISSIONS: Record<string, Partial<Record<Resource, Action[]>>> = {
  admin: {
    properties: ['view', 'create', 'edit', 'delete', 'manage'],
    tokens: ['view', 'create', 'edit', 'delete', 'manage'],
    bookings: ['view', 'create', 'edit', 'delete', 'manage'],
    users: ['view', 'create', 'edit', 'delete', 'manage'],
    messages: ['view', 'create', 'edit', 'delete', 'manage'],
    analytics: ['view', 'manage'],
    settings: ['view', 'edit', 'manage'],
  },
  staff: {
    properties: ['view', 'edit'],
    tokens: ['view'],
    bookings: ['view', 'create', 'edit'],
    users: ['view'],
    messages: ['view', 'create', 'edit'],
    analytics: ['view'],
    settings: ['view'],
  },
  owner: {
    properties: ['view', 'create', 'edit', 'delete', 'manage'],
    bookings: ['view', 'edit'],
    messages: ['view', 'create'],
    analytics: ['view'],
  },
};

export function usePermissions() {
  const { user } = useAuth();
  const role = user?.role ?? 'guest';

  const can = (action: Action, resource: Resource): boolean => {
    const perms = ROLE_PERMISSIONS[role]?.[resource];
    if (!perms) return false;
    return perms.includes(action) || perms.includes('manage');
  };

  const canAny = (actions: Action[], resource: Resource): boolean => {
    return actions.some((a) => can(a, resource));
  };

  const isAdmin = role === 'admin';
  const isStaff = role === 'staff' || role === 'admin';

  return { can, canAny, isAdmin, isStaff, role };
}
