import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";

const EXAMPLE = `[
  {
    "title": "Heavyweight Field Jacket",
    "description": "Cotton canvas jacket built for city weather.",
    "category": "Jackets",
    "subCategory": "Field Jacket",
    "price": 2499,
    "oldPrice": 2999,
    "images": ["https://example.com/jacket-1.jpg"],
    "sizes": [
      { "size": "S", "stock": 5 },
      { "size": "M", "stock": 8 },
      { "size": "L", "stock": 4 }
    ]
  }
]`;

export default function BulkImport() {
  const { token } = useAuth();
  const [text, setText] = useState("");
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const handleImport = async (e) => {
    e.preventDefault();
    setError("");
    setResults(null);

    let parsed;
    try {
      parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) throw new Error("JSON must be an array of products.");
    } catch (err) {
      setError(`Couldn't parse JSON: ${err.message}`);
      return;
    }

    setRunning(true);
    const outcome = { success: 0, failed: [] };
    
    for (let i = 0; i < parsed.length; i++) {
      const item = parsed[i];
      try {
        await api.createProduct(item, token);
        outcome.success += 1;
      } catch (err) {
        outcome.failed.push({ index: i, title: item.title || `Row ${i + 1}`, message: err.message });
      }
    }

    setResults(outcome);
    setRunning(false);
  };

  return (
    <div>
      <h3 style={{ fontFamily: "var(--font-display)", textTransform: "uppercase", marginBottom: 10 }}>
        Bulk Import Products
      </h3>
      <p className="helper-text" style={{ marginBottom: 20 }}>
        Paste a JSON array of products below. Each one is created the same way as the
        "Add Product" form, one after another.
      </p>

      <form onSubmit={handleImport}>
        <div className="field">
          <label>Products (JSON array)</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={EXAMPLE}
            style={{ minHeight: 260, fontFamily: "monospace", fontSize: 13 }}
            required
          />
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <button className="btn btn-primary" disabled={running}>
            {running ? "Importing…" : "Import Products"}
          </button>
          <button type="button" className="btn btn-outline" onClick={() => setText(EXAMPLE)}>
            Load Example
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}
      </form>

      {results && (
        <div className="empty-state" style={{ margin: 0, maxWidth: "none", textAlign: "left" }}>
          <h3 style={{ marginBottom: 10 }}>Import Complete</h3>
          <p>
            {results.success} product(s) created successfully.
            {results.failed.length > 0 && ` ${results.failed.length} failed.`}
          </p>
          {results.failed.length > 0 && (
            <ul style={{ fontSize: 13, color: "var(--red)", marginTop: 10 }}>
              {results.failed.map((f) => (
                <li key={f.index}>
                  {f.title}: {f.message}
                </li>
              ))}
            </ul>
          )}
          <Link to="/admin/products" className="btn btn-primary" style={{ marginTop: 16 }}>
            View Products
          </Link>
        </div>
      )}
    </div>
  );
}
