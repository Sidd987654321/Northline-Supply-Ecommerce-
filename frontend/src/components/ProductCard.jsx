import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

export default function ProductCard({ product }) {
  const { token } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  const totalStock = (product.sizes || []).reduce((s, x) => s + x.stock, 0);
  const wished = isWishlisted(product._id);

  const handleWishClick = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate("/login");
      return;
    }
    toggleWishlist(product);
  };

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <button
        className={`wish-toggle ${wished ? "active" : ""}`}
        onClick={handleWishClick}
        aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
      >
        {wished ? "♥" : "♡"}
      </button>
      <div className="product-thumb">
        <img src={product.images?.[0]} alt={product.title} loading="lazy" />
      </div>
      <div className="product-info">
        <span className="product-category">
          {product.category} {product.subCategory ? `· ${product.subCategory}` : ""}
        </span>
        <span className="product-title">{product.title}</span>
        <div className="product-price">
          <span>₹{product.price}</span>
          {product.oldPrice && (
            <span className="old-price">₹{product.oldPrice}</span>
          )}
        </div>
        {totalStock === 0 && <span className="stock-tag">Out of stock</span>}
      </div>
    </Link>
  );
}
