import { shareAuthentication } from "@/utils/helpers/shareAuthentication";
import { FC, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface IPrivateRoutesProps {
  children: ReactNode;
}
const PrivateRoutes: FC<IPrivateRoutesProps> = ({ children }) => {
  const location = useLocation();

  const { email } = shareAuthentication();
  if (!email) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export default PrivateRoutes;
