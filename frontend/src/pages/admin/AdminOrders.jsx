import { useEffect, useState } from "react";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import Toast from "../../components/Toast";

const STATUSES = ["Pending", "Packed", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const load = () => {
    setLoading(true);
    api
      .getAllOrders(token)
      .then(setOrders)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus, token);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
      setToast("Order status updated");
    } catch (err) {
      setToast(err.message);
    } finally {
      setTimeout(() => setToast(""), 1800);
    }
  };

  return (
    <div>
      <h3 style={{ fontFamily: "var(--font-display)", textTransform: "uppercase", marginBottom: 20 }}>
        {orders.length} Orders
      </h3>

      {loading && <p className="spinner-note">Loading…</p>}

      {!loading && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>#{o._id.slice(-8).toUpperCase()}</td>
                <td>
                  {o.user?.name}
                  <div className="helper-text">{o.user?.email}</div>
                </td>
                <td>{o.products.length}</td>
                <td>₹{o.total}</td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td>
                  <select
                    value={o.orderStatus}
                    onChange={(e) => handleStatusChange(o._id, e.target.value)}
                    style={{ padding: 6, borderRadius: 2, border: "1px solid var(--line)" }}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && orders.length === 0 && <p className="spinner-note">No orders yet.</p>}

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
