import { BrowserRouter, Routes, Route } from "react-router-dom";
// Routes
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
// Layouts
import AdminLayout from "@/layouts/AdminLayout";
import AuthLayout from "@/layouts/AuthLayout";
// Pages
import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/dashboard/Dashboard";
import ProductList from "@/pages/products/ProductList";
import ProductCreate from "@/pages/products/ProductCreate";
import Category from "@/pages/category/Category";
import CategoryCreate from "@/pages/category/CategoryCreate";
import CategoryEdit from "@/pages/category/CategoryEdit";
import OrderDetails from "@/pages/orders/OrderDetails";
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/*  PUBLIC */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>
        </Route>
        {/*  PRIVATE */}
        <Route element={<PrivateRoute />}>
          <Route element={<AdminLayout />}>
            {/* Dashboard */}
            <Route index element={<Dashboard />} />
            <Route path="categories" element={<Category />} />
            <Route element={<AdminRoute />}>
              <Route path="categories/create" element={<CategoryCreate />} />
              <Route path="categories/edit/:id" element={<CategoryEdit />} />
            </Route>
            {/* Products */}
            <Route path="products" element={<ProductList />} />
            {/*  ADMIN ONLY */}
            <Route element={<AdminRoute />}>
              <Route path="products/create" element={<ProductCreate />} />
              <Route path="orders" element={<OrderDetails />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default AppRouter;
