import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="page container">
      <h1 className="page-title">Admin Panel</h1>
      <p className="page-sub">Manage products, orders and stock.</p>

      <div className="admin-shell">
        <nav className="admin-nav">
          <NavLink to="/admin" end>
            Dashboard
          </NavLink>
          <NavLink to="/admin/products">Products</NavLink>
          <NavLink to="/admin/products/bulk-import">Bulk Import</NavLink>
          <NavLink to="/admin/orders">Orders</NavLink>
        </nav>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
