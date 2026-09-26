import { useEffect, useState } from "react";
import api from "../api";
import ProductCard from "../components/ProductCard";

const CATEGORIES = ["Jackets", "Shirts", "T-Shirts", "Trousers", "Footwear", "Accessories"];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);

    setLoading(true);
    const timer = setTimeout(() => {
      api
        .getProducts(`?${params.toString()}`)
        .then(setProducts)
        .catch(() => setProducts([]))
        .finally(() => setLoading(false));
    }, 300); // small debounce so typing doesn't fire a request per keystroke

    return () => clearTimeout(timer);
  }, [search, category, sort]);

  return (
    <div className="page container">
      <h1 className="page-title">Shop Menswear</h1>
      <p className="page-sub">Every piece in the current lineup.</p>

      <div className="filters-bar">
        <input
          type="search"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort: Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A–Z</option>
          <option value="name_desc">Name: Z–A</option>
        </select>
      </div>

      {loading && <p className="spinner-note">Loading products…</p>}
      {!loading && products.length === 0 && (
        <p className="spinner-note">No products match your filters.</p>
      )}

      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}
