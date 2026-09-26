import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { totalCount } = useCart();
  const { items: wishItems } = useWishlist();
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand">
          Northline
          <small>Supply</small>
        </NavLink>

        <nav>
          <ul className="nav-links">
            <li>
              <NavLink to="/shop">Shop</NavLink>
            </li>
            <li>
              <NavLink to="/orders">My Orders</NavLink>
            </li>
            {isAdmin && (
              <li>
                <NavLink to="/admin">Admin</NavLink>
              </li>
            )}
          </ul>
        </nav>

        <div className="nav-icons">
          <NavLink to="/wishlist" className="icon-btn" aria-label="Wishlist">
            ♥
            {wishItems.length > 0 && (
              <span className="badge">{wishItems.length}</span>
            )}
          </NavLink>

          {user ? (
            <button
              className="icon-btn"
              onClick={() => {
                logout();
                navigate("/");
              }}
              title={`Sign out (${user.name})`}
            >
              👤
            </button>
          ) : (
            <NavLink to="/login" className="icon-btn" aria-label="Sign in">
              👤
            </NavLink>
          )}

          <NavLink to="/cart" className="bag-count">
            🛍 {totalCount}
          </NavLink>
        </div>
      </div>
    </header>
  );
}
