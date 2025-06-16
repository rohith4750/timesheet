// Permission IDs and their corresponding names
export const PERMISSIONS = {
  CREATE_PROJECT: 'create_project',
  EDIT_PROJECT: 'edit_project',
  DELETE_PROJECT: 'delete_project',
  VIEW_PROJECT: 'view_project',
  CREATE_TASK: 'create_task',
  EDIT_TASK: 'edit_task',
  DELETE_TASK: 'delete_task',
  VIEW_TASK: 'view_task',
  APPROVE_TASK: 'approve_task',
  CREATE_USER: 'create_user',
  EDIT_USER: 'edit_user',
  DELETE_USER: 'delete_user',
  VIEW_USER: 'view_user',
  ASSIGN_PROJECT: 'assign_project',
  UNASSIGN_PROJECT: 'unassign_project',
  VIEW_PROJECT_ASSIGNMENTS: 'view_project_assignments',
  REJECT_TASK: 'reject_task'
} as const;

// Role IDs and their corresponding names
export const ROLES = {
  ADMIN: 'ADMIN',
  PROJECT_MANAGER: 'PROJECT_MANAGER',
  USER: 'USER'
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
export type Role = typeof ROLES[keyof typeof ROLES];

// Role-based permission mappings
export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  [ROLES.ADMIN]: [
    PERMISSIONS.CREATE_PROJECT,
    PERMISSIONS.EDIT_PROJECT,
    PERMISSIONS.DELETE_PROJECT,
    PERMISSIONS.VIEW_PROJECT,
    PERMISSIONS.VIEW_TASK,
    PERMISSIONS.APPROVE_TASK,
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.EDIT_USER,
    PERMISSIONS.DELETE_USER,
    PERMISSIONS.VIEW_USER,
    PERMISSIONS.ASSIGN_PROJECT,
    PERMISSIONS.UNASSIGN_PROJECT,
    PERMISSIONS.VIEW_PROJECT_ASSIGNMENTS,
    PERMISSIONS.REJECT_TASK
  ] as const,
  [ROLES.PROJECT_MANAGER]: [
    PERMISSIONS.EDIT_PROJECT,
    PERMISSIONS.VIEW_PROJECT,
    PERMISSIONS.APPROVE_TASK,
    PERMISSIONS.ASSIGN_PROJECT,
    PERMISSIONS.UNASSIGN_PROJECT,
    PERMISSIONS.VIEW_PROJECT_ASSIGNMENTS
  ] as const,
  [ROLES.USER]: [
    PERMISSIONS.VIEW_PROJECT,
    PERMISSIONS.VIEW_TASK,
    PERMISSIONS.VIEW_PROJECT_ASSIGNMENTS
  ] as const
};

// Helper function to get permissions for a role
export const getPermissionsForRole = (role: Role): Permission[] => {
  return [...ROLE_PERMISSIONS[role]];
};

// Helper function to check if a role has a specific permission
export const hasPermission = (role: Role, permission: Permission): boolean => {
  const rolePermissions = ROLE_PERMISSIONS[role];
  return rolePermissions.includes(permission);
}; 