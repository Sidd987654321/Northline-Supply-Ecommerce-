import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const FREE_SHIPPING_THRESHOLD = 999;
const FLAT_SHIPPING_CHARGE = 49;

export default function Cart() {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shippingCharge = items.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_CHARGE;
  const total = subtotal + shippingCharge;

  const handleCheckout = () => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: "/checkout" } } });
      return;
    }
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="page container">
        <div className="empty-state">
          <div className="empty-icon">🛍</div>
          <h3>Your bag is empty</h3>
          <p>Keep an eye out for the pieces that feel like you.</p>
          <Link to="/shop" className="btn btn-primary">
            Browse the Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page container">
      <h1 className="page-title">Your Bag</h1>
      <p className="page-sub">{items.length} item(s)</p>

      <div className="cart-layout">
        <div>
          {items.map((item) => (
            <div className="cart-item" key={item.productId + item.size}>
              <img src={item.image} alt={item.title} />
              <div>
                <div className="cart-item-title">{item.title}</div>
                <div className="cart-item-meta">
                  Size {item.size} · ₹{item.price} each
                </div>
              </div>
              <div className="cart-item-actions">
                <div className="qty-stepper">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.size, item.quantity - 1)
                    }
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.size, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
                <button
                  className="remove-link"
                  onClick={() => removeFromCart(item.productId, item.size)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="summary-box">
          <div className="summary-row">
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
          {subtotal < FREE_SHIPPING_THRESHOLD && (
            <p className="coupon-note">
              Add ₹{FREE_SHIPPING_THRESHOLD - subtotal} more for free shipping.
            </p>
          )}
          <button className="btn btn-primary btn-full" style={{ marginTop: 16 }} onClick={handleCheckout}>
            Checkout →
          </button>
        </aside>
      </div>
    </div>
  );
}
