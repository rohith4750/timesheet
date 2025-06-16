import React from 'react'
import { Navigate } from 'react-router-dom'
import { permissionAccess, userRoleAccess } from './permissionAccess'
import { Permission, Role } from '../constants/permissions'

interface AuthProps {
  userRole?: Role[];
  permissions?: Permission | 'ALL';
}

const withRoleAuthorization = (WrappedComponent: React.FC, item: AuthProps) => {
  return (props: any) => {
    const hasRole = userRoleAccess(item.userRole || []);
    if (!hasRole) {
      if (permissionAccess(item.permissions || 'ALL')) {
        return <WrappedComponent {...props} />
      } else {
        return <Navigate to='/unauthorized' replace={true} />
      }
    } else {
      return <WrappedComponent {...props} />
    }
  }
}

export const withAuthentication = (WrappedComponent: React.FC, item: AuthProps) => {
  return (props: any) => {
    const isAuthenticated = localStorage.getItem('isLogin') === 'true' && localStorage.getItem('auth_token') !== null

    const RoleAuthComponent = withRoleAuthorization(WrappedComponent, item)

    if (isAuthenticated) {
      return <RoleAuthComponent {...props} />
    } else {
      return <Navigate to='/login' replace={true} />
    }
  }
}
