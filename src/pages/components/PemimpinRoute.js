// PemimpinRoute.js
import RoleRoute from "./RoleRoute";

const PemimpinRoute = ({ children }) => {
  return <RoleRoute requiredRole="pemimpin">{children}</RoleRoute>;
};

export default PemimpinRoute;
