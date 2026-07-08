import React from 'react'
import { useAuth } from '../context/AuthProvider'
import { Navigate, Outlet } from 'react-router';

function ProtectedRoute() {
  const { authenticated, authLoading } = useAuth();

  if(authLoading) {
    return <p>Loading...</p>
  }

  if(!authenticated) {
    return <Navigate to="/" />
  }
 
  return (
    <Outlet />
  )
}

export default ProtectedRoute