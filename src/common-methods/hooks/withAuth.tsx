import React from 'react'
import { Navigate } from 'react-router-dom'
import { permissionAccess, userRoleAccess } from './permissionAccess'

const withRoleAuthorization = (WrappedComponent: React.FC, item: any) => {
  return (props: any) => {
    if (userRoleAccess(item.userRole)[0] !== 'SYSTEM_ADMIN') {
      if (permissionAccess(item.permissions)) {
        return <WrappedComponent {...props} />
      } else {
        return <Navigate to='/unauthorized' replace={true} />
      }
    } else {
      return <WrappedComponent {...props} />
    }
  }
}

export const withAuthentication = (WrappedComponent: React.FC, item: any) => {
  return (props: any) => {
    const isAuthenticated = localStorage.getItem('isLogin') || false

    const RoleAuthComponent = withRoleAuthorization(WrappedComponent, item)

    if (isAuthenticated) {
      return <RoleAuthComponent {...props} />
    } else {
      return <Navigate to='/login' replace={true} />
    }
  }
}
