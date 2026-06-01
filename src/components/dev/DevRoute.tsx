import { Navigate, useLocation } from "react-router";
import { useAuth } from "../../stores/useAuth";

interface DevRouteProps {
  children: React.ReactNode;
}

function DevRoute({ children }: DevRouteProps) {
  const user = useAuth((s) => s.user);
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  if (user.role !== "dev") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default DevRoute;