// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  // If token exists, allow access to the protected page, otherwise redirect to login
  return token ? children : <Navigate to="/" />;
};

export default PrivateRoute;
