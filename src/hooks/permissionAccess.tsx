export function permissionAccess(type: string) {
  let roles = localStorage.getItem('permissions')?.replace(/ /g, '')?.split(',') ?? []
  let allowedRoles = type.replace(/ /g, '').split(',') ?? []
  let hasPermission =
    allowedRoles?.length && roles?.length ? roles.some((role) => allowedRoles.includes(role)) : true
  if (type === 'ALL') {
    hasPermission = true
  }
  return hasPermission
}

export function userRoleAccess(userRoles: any) {
  console.log('userRoleAccess - ', userRoles)
  let role = localStorage.getItem('userRole') ?? ''
  let allowedRole = userRoles ?? []
  let hasPermission = allowedRole.filter((item: any) => item === role)
  return hasPermission
}

export const getUserRoleName = () => {
  return localStorage.getItem('userRole')
}
