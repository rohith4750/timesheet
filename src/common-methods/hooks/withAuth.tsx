import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../services/auth'

const withAuth = (WrappedComponent: React.FC) => {
  return (props: any) => {
    const { isAuthenticated, user } = useAuth()

    if (!isAuthenticated) {
      return <Navigate to='/login' replace />
    }

    // Optional: Role-based access control
    // if (user?.role !== 'admin') {
    //   return <Navigate to="/unauthorized" replace />;
    // }

    return <WrappedComponent {...props} />
  }
}

export default withAuth
