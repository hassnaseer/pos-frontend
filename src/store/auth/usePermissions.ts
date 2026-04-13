import type { UserRole } from "./authSlice";

export interface AccessRule {
  role: string;
  canAccessPOS: boolean;
  canManageProducts: boolean;
  canManageTickets: boolean;
  canManageCustomers: boolean;
  canPostToSocialMedia: boolean;
}

const DEFAULT_BY_ROLE: Record<string, AccessRule> = {
  "super-admin": {
    role: "super-admin",
    canAccessPOS: true,
    canManageProducts: true,
    canManageTickets: true,
    canManageCustomers: true,
    canPostToSocialMedia: true,
  },
  admin: {
    role: "admin",
    canAccessPOS: true,
    canManageProducts: true,
    canManageTickets: true,
    canManageCustomers: true,
    canPostToSocialMedia: true,
  },
  cashier: {
    role: "cashier",
    canAccessPOS: true,
    canManageProducts: false,
    canManageTickets: false,
    canManageCustomers: true,
    canPostToSocialMedia: false,
  },
  manager: {
    role: "manager",
    canAccessPOS: true,
    canManageProducts: true,
    canManageTickets: true,
    canManageCustomers: true,
    canPostToSocialMedia: true,
  },
  technician: {
    role: "technician",
    canAccessPOS: true,
    canManageProducts: true,
    canManageTickets: true,
    canManageCustomers: false,
    canPostToSocialMedia: false,
  },
};

/** Effective access: user.permissions from API overrides defaults per role. */
export const getPermissionsForRole = (role: string): AccessRule | null => {
  const base = DEFAULT_BY_ROLE[role];
  if (!base) return null;
  return { ...base };
};

export function mergeUserPermissions(
  role: UserRole | string | undefined,
  permissions?: Record<string, boolean> | null
): AccessRule | null {
  const base = role ? getPermissionsForRole(role) : null;
  if (!base) return null;
  if (!permissions) return base;
  return {
    ...base,
    canAccessPOS: permissions.canAccessPOS ?? base.canAccessPOS,
    canManageProducts: permissions.canManageProducts ?? base.canManageProducts,
    canManageTickets: permissions.canManageTickets ?? base.canManageTickets,
    canManageCustomers: permissions.canManageCustomers ?? base.canManageCustomers,
    canPostToSocialMedia: permissions.canPostToSocialMedia ?? base.canPostToSocialMedia,
  };
}
