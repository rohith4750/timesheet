import { PERMISSIONS, ROLES, hasPermission, Permission, Role } from '../constants/permissions';

export function permissionAccess(permission: Permission | 'ALL'): boolean {
  if (permission === 'ALL') {
    return true;
  }

  const userRole = (localStorage.getItem('userRole') || '').toUpperCase() as Role;
  if (!userRole) {
    return false;
  }

  return hasPermission(userRole, permission);
}

export function userRoleAccess(allowedRoles: Role[]): boolean {
  const userRole = (localStorage.getItem('userRole') || '').toUpperCase() as Role;
  if (!userRole) {
    return false;
  }

  return allowedRoles.includes(userRole);
}

export const getUserRoleName = (): Role | '' => {
  return (localStorage.getItem('userRole') as Role) || '';
};
