import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getProducts("?sort=newest")
      .then((data) => setProducts(data.slice(0, 8)))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <p className="hero-eyebrow">ISSUE 026 / CITY UNIFORM</p>
          <h1 className="hero-title">
            CUT THROUGH
            <span>THE NOISE.</span>
          </h1>
          <p className="hero-sub">
            Menswear for the fast lane. Utility silhouettes, heavyweight
            cottons, and the right amount of signal.
          </p>
          <Link to="/shop" className="btn btn-primary">
            Shop the Drop →
          </Link>
        </div>
        <div className="hero-drop-tag">
          <small>Drop 01</small>
          <strong>After Dark</strong>
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <div>
            <h2>New In</h2>
            <p>Fresh off the line — the latest additions to the shop.</p>
          </div>
          <Link to="/shop" className="btn btn-outline btn-sm">
            View all
          </Link>
        </div>

        {loading && <p className="spinner-note">Loading products…</p>}
        {!loading && products.length === 0 && (
          <p className="spinner-note">
            No products yet. Add some from the admin panel.
          </p>
        )}
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
