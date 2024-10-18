// OperatorRoute.js
import RoleRoute from "./RoleRoute";

const OperatorRoute = ({ children }) => {
  return <RoleRoute requiredRole="operator">{children}</RoleRoute>;
};

export default OperatorRoute;
