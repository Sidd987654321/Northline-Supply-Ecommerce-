import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page container">
      <div className="auth-shell">
        <h1 className="page-title" style={{ fontSize: 24, marginBottom: 24 }}>
          Create Account
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Full Name</label>
            <input value={form.name} onChange={update("name")} required />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={update("email")} required />
          </div>
          <div className="field">
            <label>Phone</label>
            <input value={form.phone} onChange={update("phone")} />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={form.password} onChange={update("password")} required minLength={6} />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button className="btn btn-primary btn-full" disabled={loading}>
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
