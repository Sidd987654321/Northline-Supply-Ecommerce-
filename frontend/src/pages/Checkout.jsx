import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../api";

const FREE_SHIPPING_THRESHOLD = 999;
const FLAT_SHIPPING_CHARGE = 49;

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
  });
  const [couponCode, setCouponCode] = useState("");
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  const shippingCharge = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_CHARGE;
  const total = subtotal + shippingCharge;

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Your bag is empty.");
      return;
    }
    for (const key of ["fullName", "phone", "address", "city", "state", "pinCode"]) {
      if (!form[key]) {
        setError("Please fill in every field.");
        return;
      }
    }

    setPlacing(true);
    try {
      const orderItems = items.map((i) => ({
        productId: i.productId,
        size: i.size,
        quantity: i.quantity,
      }));
      const order = await api.createOrder(
        {
          items: orderItems,
          shippingAddress: {
            fullName: form.fullName,
            phone: form.phone,
            address: form.address,
            city: form.city,
            state: form.state,
            pinCode: form.pinCode,
          },
          couponCode: couponCode || undefined,
        },
        token
      );
      clearCart();
      navigate("/orders", { state: { justPlacedId: order._id } });
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="page container">
      <p className="crumbs">Cart → Details → Confirmation</p>
      <h1 className="page-title">Where should we send it?</h1>
      <p className="page-sub">No payment needed. We'll confirm your order and get it moving.</p>

      <div className="cart-layout">
        <form onSubmit={handlePlaceOrder}>
          <div className="form-grid">
            <div className="field">
              <label>Full Name</label>
              <input value={form.fullName} onChange={update("fullName")} />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" value={form.email} onChange={update("email")} />
            </div>
            <div className="field">
              <label>Phone</label>
              <input value={form.phone} onChange={update("phone")} />
            </div>
            <div className="field">
              <label>Address</label>
              <input value={form.address} onChange={update("address")} />
            </div>
            <div className="field">
              <label>City</label>
              <input value={form.city} onChange={update("city")} />
            </div>
            <div className="field">
              <label>State</label>
              <input value={form.state} onChange={update("state")} />
            </div>
            <div className="field">
              <label>Pin Code</label>
              <input value={form.pinCode} onChange={update("pinCode")} />
            </div>
            <div className="field">
              <label>Coupon Code (optional)</label>
              <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="SAVE10" />
            </div>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button className="btn btn-primary" disabled={placing}>
            {placing ? "Placing Order…" : "Place Order →"}
          </button>
        </form>

        <aside className="summary-box">
          {items.map((item) => (
            <div className="order-line" key={item.productId + item.size}>
              <img src={item.image} alt={item.title} />
              <div style={{ flex: 1 }}>
                <div>{item.title}</div>
                <div className="helper-text">
                  Size {item.size} × {item.quantity}
                </div>
              </div>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="summary-row total">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shippingCharge === 0 ? "Free" : `₹${shippingCharge}`}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
