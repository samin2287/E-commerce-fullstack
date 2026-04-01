import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const isLoggedIn = false; // 🔥 temporary

  return !isLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
};

export default PublicRoute;
