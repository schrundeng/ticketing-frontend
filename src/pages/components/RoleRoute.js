import React from "react";
import { Navigate } from "react-router-dom";

const RoleRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // If token exists and role matches the requiredRole, allow access
  return token && role === requiredRole ? children : <Navigate to="/" />;
};

export default RoleRoute;