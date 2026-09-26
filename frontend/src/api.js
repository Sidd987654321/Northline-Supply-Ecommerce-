// Small fetch wrapper around the Express backend.
// Change VITE_API_URL in your .env file if the backend runs somewhere else.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    // some endpoints (like DELETE) may return no body
  }

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return data;
}

const api = {
  // ---- auth ----
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),

  // ---- products (public) ----
  getProducts: (queryString = "") => request(`/products${queryString}`),
  getProduct: (id) => request(`/products/${id}`),

  // ---- products (admin) ----
  createProduct: (payload, token) =>
    request("/products", { method: "POST", body: payload, token }),
  updateProduct: (id, payload, token) =>
    request(`/products/${id}`, { method: "PUT", body: payload, token }),
  deleteProduct: (id, token) =>
    request(`/products/${id}`, { method: "DELETE", token }),

  // ---- orders ----
  createOrder: (payload, token) =>
    request("/orders", { method: "POST", body: payload, token }),
  getMyOrders: (token) => request("/orders/my", { token }),
  getOrder: (id, token) => request(`/orders/${id}`, { token }),
  cancelOrder: (id, token) =>
    request(`/orders/${id}/cancel`, { method: "PUT", token }),
  getAllOrders: (token) => request("/orders", { token }),
  updateOrderStatus: (id, orderStatus, token) =>
    request(`/orders/${id}/status`, { method: "PUT", body: { orderStatus }, token }),

  // ---- wishlist ----
  getWishlist: (token) => request("/wishlist", { token }),
  addToWishlist: (productId, token) =>
    request(`/wishlist/${productId}`, { method: "POST", token }),
  removeFromWishlist: (productId, token) =>
    request(`/wishlist/${productId}`, { method: "DELETE", token }),

  // ---- admin ----
  getDashboardStats: (token) => request("/admin/dashboard", { token }),
};

export default api;
