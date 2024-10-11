// PrivateRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSnackbar } from '../components/SnackbarContext';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const showSnackbar = useSnackbar();
  
  // If token exists, allow access to the protected page, otherwise redirect to login
  if (!token) {
    showSnackbar('Your session has expired. Please log in again.');
    return <Navigate to="/" state={{ from: location }} />;
  }
  
  return children;
};

export default PrivateRoute;

