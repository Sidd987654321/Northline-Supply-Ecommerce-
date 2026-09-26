import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function MyOrders() {
  const { token } = useAuth();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = () => {
    setLoading(true);
    api
      .getMyOrders(token)
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = async (orderId) => {
    try {
      await api.cancelOrder(orderId, token);
      loadOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page container">
      <h1 className="page-title">My Orders</h1>
      <p className="page-sub">Track and manage what you've ordered.</p>

      {location.state?.justPlacedId && (
        <p className="helper-text" style={{ marginBottom: 20, color: "var(--red)" }}>
          Order placed! We'll get it moving.
        </p>
      )}

      {loading && <p className="spinner-note">Loading orders…</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && orders.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No orders yet</h3>
          <p>Once you place an order, it'll show up here.</p>
          <Link to="/shop" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      )}

      {orders.map((order) => (
        <div className="order-card" key={order._id}>
          <div className="order-card-head">
            <div>
              <div className="order-id">Order #{order._id.slice(-8).toUpperCase()}</div>
              <div className="helper-text">
                {new Date(order.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
            <span className={`status-pill status-${order.orderStatus}`}>
              {order.orderStatus}
            </span>
          </div>

          {order.products.map((p, idx) => (
            <div className="order-line" key={idx}>
              <img src={p.image} alt={p.title} />
              <div style={{ flex: 1 }}>
                <div>{p.title}</div>
                <div className="helper-text">
                  Size {p.size} × {p.quantity}
                </div>
              </div>
              <span>₹{p.price * p.quantity}</span>
            </div>
          ))}

          <div className="summary-row total">
            <span>Total</span>
            <span>₹{order.total}</span>
          </div>

          {order.orderStatus === "Pending" && (
            <button
              className="btn btn-danger btn-sm"
              style={{ marginTop: 12 }}
              onClick={() => handleCancel(order._id)}
            >
              Cancel Order
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
