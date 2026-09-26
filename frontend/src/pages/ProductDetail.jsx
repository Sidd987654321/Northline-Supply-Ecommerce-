import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import Toast from "../components/Toast";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .getProduct(id)
      .then((data) => {
        setProduct(data);
        const firstInStock = data.sizes?.find((s) => s.stock > 0);
        setSelectedSize(firstInStock?.size || data.sizes?.[0]?.size || null);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="center-note">Loading product…</p>;
  if (!product) return <p className="center-note">Product not found.</p>;

  const sizeEntry = product.sizes.find((s) => s.size === selectedSize);
  const inStock = sizeEntry && sizeEntry.stock > 0;
  const wished = isWishlisted(product._id);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart(product, selectedSize, quantity);
    setToast("Added to your bag");
    setTimeout(() => setToast(""), 1800);
  };

  const handleWishlist = () => {
    if (!token) {
      navigate("/login");
      return;
    }
    toggleWishlist(product);
  };

  return (
    <div className="page container">
      <p className="crumbs">Shop / {product.category} / {product.title}</p>

      <div className="detail-grid">
        <div>
          <div className="gallery-main">
            <img src={product.images[activeImage]} alt={product.title} />
          </div>
          {product.images.length > 1 && (
            <div className="gallery-thumbs">
              {product.images.map((img, idx) => (
                <button
                  key={img + idx}
                  className={idx === activeImage ? "active" : ""}
                  onClick={() => setActiveImage(idx)}
                >
                  <img src={img} alt={`${product.title} ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <span className="product-category">
            {product.category} {product.subCategory ? `· ${product.subCategory}` : ""}
          </span>
          <h1 className="page-title" style={{ marginTop: 6 }}>
            {product.title}
          </h1>

          <div className="detail-price">
            <span>₹{product.price}</span>
            {product.oldPrice && <span className="old-price">₹{product.oldPrice}</span>}
          </div>

          <div>
            <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-soft)" }}>
              Size
            </label>
            <div className="size-row">
              {product.sizes.map((s) => (
                <button
                  key={s.size}
                  className={`size-pill ${selectedSize === s.size ? "selected" : ""}`}
                  disabled={s.stock === 0}
                  onClick={() => setSelectedSize(s.size)}
                >
                  {s.size}
                </button>
              ))}
            </div>
          </div>

          <div className="qty-row">
            <div className="qty-stepper">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
              <span>{quantity}</span>
              <button
                onClick={() =>
                  setQuantity((q) => (sizeEntry ? Math.min(sizeEntry.stock, q + 1) : q + 1))
                }
              >
                +
              </button>
            </div>
            {sizeEntry && (
              <span className="helper-text">
                {inStock ? `${sizeEntry.stock} in stock` : "Out of stock"}
              </span>
            )}
          </div>

          <div className="detail-actions">
            <button className="btn btn-primary" disabled={!inStock} onClick={handleAddToCart}>
              {inStock ? "Add to Bag" : "Out of Stock"}
            </button>
            <button className="btn btn-outline" onClick={handleWishlist}>
              {wished ? "♥ Saved" : "♡ Save"}
            </button>
          </div>

          <p className="detail-desc">{product.description}</p>
        </div>
      </div>

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
