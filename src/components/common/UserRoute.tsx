import { Navigate, useLocation } from "react-router";
import { useAuth } from "../../stores/useAuth";

interface UserRouteProps {
  children: React.ReactNode;
}

function UserRoute({ children }: UserRouteProps) {
  const user = useAuth((s) => s.user);
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname, unauthorized: true }}
        replace
      />
    );
  }
  
  if (!user.isVerified) {
    return <Navigate to="/" state={{ unverified: true }} replace />;
  }

  if (user.role !== "user") {
    return <Navigate to="/" replace />;
  }


  return <>{children}</>;
}

export default UserRoute;
