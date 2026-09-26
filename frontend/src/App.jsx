import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { RequireAuth, RequireAdmin } from "./components/RouteGuards";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Wishlist from "./pages/Wishlist";
import MyOrders from "./pages/MyOrders";

import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import ProductForm from "./pages/admin/ProductForm";
import BulkImport from "./pages/admin/BulkImport";
import AdminOrders from "./pages/admin/AdminOrders";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <Checkout />
              </RequireAuth>
            }
          />
          <Route
            path="/wishlist"
            element={
              <RequireAuth>
                <Wishlist />
              </RequireAuth>
            }
          />
          <Route
            path="/orders"
            element={
              <RequireAuth>
                <MyOrders />
              </RequireAuth>
            }
          />

          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id/edit" element={<ProductForm />} />
            <Route path="products/bulk-import" element={<BulkImport />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>

          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
