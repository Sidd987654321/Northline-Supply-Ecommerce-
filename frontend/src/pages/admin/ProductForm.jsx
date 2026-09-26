import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";

const emptyProduct = {
  title: "",
  description: "",
  category: "",
  subCategory: "",
  price: "",
  oldPrice: "",
  images: [""],
  sizes: [{ size: "", stock: "" }],
};

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyProduct);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    api
      .getProduct(id)
      .then((data) =>
        setForm({
          ...data,
          price: String(data.price),
          oldPrice: data.oldPrice ? String(data.oldPrice) : "",
          images: data.images.length ? data.images : [""],
          sizes: data.sizes.length
            ? data.sizes.map((s) => ({ size: s.size, stock: String(s.stock) }))
            : [{ size: "", stock: "" }],
        })
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const updateField = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const updateImage = (idx, value) => {
    const images = [...form.images];
    images[idx] = value;
    setForm({ ...form, images });
  };
  const addImageRow = () => setForm({ ...form, images: [...form.images, ""] });
  const removeImageRow = (idx) =>
    setForm({ ...form, images: form.images.filter((_, i) => i !== idx) });

  const updateSize = (idx, field, value) => {
    const sizes = [...form.sizes];
    sizes[idx] = { ...sizes[idx], [field]: value };
    setForm({ ...form, sizes });
  };
  const addSizeRow = () => setForm({ ...form, sizes: [...form.sizes, { size: "", stock: "" }] });
  const removeSizeRow = (idx) =>
    setForm({ ...form, sizes: form.sizes.filter((_, i) => i !== idx) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      title: form.title,
      description: form.description,
      category: form.category,
      subCategory: form.subCategory,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      images: form.images.filter((img) => img.trim() !== ""),
      sizes: form.sizes
        .filter((s) => s.size.trim() !== "")
        .map((s) => ({ size: s.size, stock: Number(s.stock) || 0 })),
    };

    if (payload.images.length === 0) {
      setError("Add at least one image URL.");
      return;
    }
    if (payload.sizes.length === 0) {
      setError("Add at least one size.");
      return;
    }

    setSaving(true);
    try {
      if (isEdit) {
        await api.updateProduct(id, payload, token);
      } else {
        await api.createProduct(payload, token);
      }
      navigate("/admin/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="spinner-note">Loading product…</p>;

  return (
    <div>
      <h3 style={{ fontFamily: "var(--font-display)", textTransform: "uppercase", marginBottom: 20 }}>
        {isEdit ? "Edit Product" : "Add Product"}
      </h3>

      <form onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
        <div className="field">
          <label>Title</label>
          <input value={form.title} onChange={updateField("title")} required />
        </div>

        <div className="field">
          <label>Description</label>
          <textarea value={form.description} onChange={updateField("description")} required />
        </div>

        <div className="form-grid">
          <div className="field">
            <label>Category</label>
            <input
              value={form.category}
              onChange={updateField("category")}
              placeholder="e.g. Jackets"
              required
            />
          </div>
          <div className="field">
            <label>Sub-category</label>
            <input
              value={form.subCategory}
              onChange={updateField("subCategory")}
              placeholder="e.g. Bomber"
              required
            />
          </div>
          <div className="field">
            <label>Price (₹)</label>
            <input type="number" min="0" value={form.price} onChange={updateField("price")} required />
          </div>
          <div className="field">
            <label>Old Price (₹, optional)</label>
            <input type="number" min="0" value={form.oldPrice} onChange={updateField("oldPrice")} />
          </div>
        </div>

        <div className="field">
          <label>Image URLs</label>
          {form.images.map((img, idx) => (
            <div className="image-input-row" key={idx}>
              <input
                value={img}
                onChange={(e) => updateImage(idx, e.target.value)}
                placeholder="https://…"
                style={{ borderBottom: "1px solid var(--line)", padding: "8px" }}
              />
              {form.images.length > 1 && (
                <button type="button" className="remove-x" onClick={() => removeImageRow(idx)}>
                  ×
                </button>
              )}
            </div>
          ))}
          <button type="button" className="dashed-add" onClick={addImageRow}>
            + Add image URL
          </button>
        </div>

        <div className="field">
          <label>Sizes & Stock</label>
          {form.sizes.map((s, idx) => (
            <div className="size-editor-row" key={idx}>
              <input
                placeholder="Size (S, M, L…)"
                value={s.size}
                onChange={(e) => updateSize(idx, "size", e.target.value)}
                style={{ borderBottom: "1px solid var(--line)", padding: "8px" }}
              />
              <input
                type="number"
                min="0"
                placeholder="Stock"
                value={s.stock}
                onChange={(e) => updateSize(idx, "stock", e.target.value)}
                style={{ borderBottom: "1px solid var(--line)", padding: "8px" }}
              />
              {form.sizes.length > 1 && (
                <button type="button" className="remove-x" onClick={() => removeSizeRow(idx)}>
                  ×
                </button>
              )}
            </div>
          ))}
          <button type="button" className="dashed-add" onClick={addSizeRow}>
            + Add size
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}

        <button className="btn btn-primary" disabled={saving}>
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Product"}
        </button>
      </form>
    </div>
  );
}
