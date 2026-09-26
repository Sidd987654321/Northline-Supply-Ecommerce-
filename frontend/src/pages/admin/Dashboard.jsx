import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getDashboardStats(token)
      .then(setStats)
      .catch((err) => setError(err.message));
  }, [token]);

  if (error) return <p className="error-text">{error}</p>;
  if (!stats) return <p className="spinner-note">Loading dashboard…</p>;

  const cards = [
    { label: "Total Products", value: stats.totalProducts },
    { label: "Total Customers", value: stats.totalUsers },
    { label: "Total Orders", value: stats.totalOrders },
    { label: "Pending Orders", value: stats.pendingOrders },
  ];

  return (
    <div>
      <div className="stat-grid">
        {cards.map((c) => (
          <div className="stat-card" key={c.label}>
            <div className="stat-num">{c.value}</div>
            <div className="stat-label">{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <Link to="/admin/products/new" className="btn btn-primary">
          + Add Product
        </Link>
        <Link to="/admin/orders" className="btn btn-outline">
          Manage Orders
        </Link>
      </div>
    </div>
  );
}
