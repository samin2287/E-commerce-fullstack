import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const user = { role: "admin" }; // 🔥 temporary

  return user.role === "admin" ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
