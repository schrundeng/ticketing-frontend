import RoleRoute from "./RoleRoute";

const AdminRoute = ({ children }) => {
  return <RoleRoute requiredRole="admin">{children}</RoleRoute>;
};

export default AdminRoute;
