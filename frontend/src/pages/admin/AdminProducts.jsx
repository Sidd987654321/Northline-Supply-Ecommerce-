import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import Toast from "../../components/Toast";

export default function AdminProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const load = () => {
    setLoading(true);
    api
      .getProducts("")
      .then(setProducts)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This can't be undone.`)) return;
    try {
      await api.deleteProduct(id, token);
      setToast("Product deleted");
      load();
    } catch (err) {
      setToast(err.message);
    } finally {
      setTimeout(() => setToast(""), 2000);
    }
  };

  return (
    <div>
      <div className="table-toolbar">
        <h3 style={{ fontFamily: "var(--font-display)", textTransform: "uppercase" }}>
          {products.length} Products
        </h3>
        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/admin/products/bulk-import" className="btn btn-outline btn-sm">
            Bulk Import
          </Link>
          <Link to="/admin/products/new" className="btn btn-primary btn-sm">
            + Add Product
          </Link>
        </div>
      </div>

      {loading && <p className="spinner-note">Loading…</p>}

      {!loading && (
        <table className="data-table">
          <thead>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const stock = (p.sizes || []).reduce((s, x) => s + x.stock, 0);
              return (
                <tr key={p._id}>
                  <td>
                    <img src={p.images?.[0]} alt={p.title} className="table-thumb" />
                  </td>
                  <td>{p.title}</td>
                  <td>{p.category}</td>
                  <td>₹{p.price}</td>
                  <td>{stock === 0 ? "Out of stock" : stock}</td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Link to={`/admin/products/${p._id}/edit`} className="btn btn-outline btn-sm">
                        Edit
                      </Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id, p.title)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {!loading && products.length === 0 && (
        <p className="spinner-note">No products yet. Add your first one.</p>
      )}

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
