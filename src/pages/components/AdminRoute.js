// AdminRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // Assuming you store the role in localStorage

  // If token exists and role is admin, allow access to the protected page
  return token && role === "admin" ? children : <Navigate to="/" />;
};

export default AdminRoute;
