import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Loader from '../common/Loader';

const AdminRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <Loader fullScreen />;

  // Check if user is logged in and has the admin role
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
