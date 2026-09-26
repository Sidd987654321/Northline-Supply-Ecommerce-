import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";

export default function Wishlist() {
  const { items, loading } = useWishlist();

  return (
    <div className="page container">
      <p className="crumbs">Your Saved Edit</p>
      <h1 className="page-title">Wishlist</h1>
      <p className="page-sub">{items.length} piece(s)</p>

      {loading && <p className="spinner-note">Loading…</p>}

      {!loading && items.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">♡</div>
          <h3>Nothing saved yet.</h3>
          <p>Keep an eye out for the pieces that feel like you.</p>
          <Link to="/shop" className="btn btn-primary">
            Browse the Edit
          </Link>
        </div>
      )}

      <div className="product-grid">
        {items.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}
