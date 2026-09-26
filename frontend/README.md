# Northline Supply — Frontend

A simple React frontend for the Ecommerce-Website backend (Express + MongoDB).
Built with **Vite + React + React Router**, plain CSS (no Tailwind/UI kit), and
the Context API for state — kept intentionally simple to read and extend.

## What's included

- **Shop** — product grid with search, category filter, and sorting
- **Product page** — image gallery, size selection, add to bag, wishlist
- **Cart & Checkout** — matches the shipping-details flow, places a real order
- **My Orders** — order history with cancel (while still "Pending")
- **Wishlist** — saved products, synced with your account
- **Auth** — register/login (JWT, stored in localStorage)
- **Admin Panel** (`/admin`, only visible to `role: "admin"` users)
  - Dashboard — totals for products, customers, orders, pending orders
  - Products — list, add, edit, delete
  - Bulk Import — paste a JSON array of products; it's created one by one
    (the backend only has a single-product `POST /api/products` route, so
    bulk import just loops that call — there's no separate bulk endpoint)
  - Orders — view every order, change its status (Pending → Packed → Shipped → Delivered / Cancelled)

## 1. Set up the backend first

The frontend expects your Express API running and reachable (default:
`http://localhost:5000/api`).

**Important:** your backend repo currently has a `.env` file committed to a
public GitHub repo. Rotate those credentials and remove the file from git
history before deploying anywhere. Also fix `package.json` — its `dev`/`start`
scripts point to `backend.js`, but the real entry file is `server.js`:

```json
"scripts": {
  "dev": "nodemon server.js",
  "start": "node server.js"
}
```

Then, from the backend folder:
```bash
npm install
npm run dev
```

You'll also need at least one **admin** user to use the admin panel. The
register endpoint always creates `role: "customer"` — promote a user to
admin directly in MongoDB (e.g. via Compass or the `mongo` shell):
```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

## 2. Run the frontend

```bash
npm install
cp .env.example .env      # edit VITE_API_URL if your backend isn't on :5000
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## 3. Build for production

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
```

## Project structure

```
src/
  api.js                 → all fetch calls to the backend, one place
  context/                → Auth, Cart (localStorage), Wishlist (server-synced)
  components/              → Navbar, ProductCard, route guards, Toast
  pages/                   → Home, Shop, ProductDetail, Cart, Checkout,
                              Login, Register, Wishlist, MyOrders
  pages/admin/              → Dashboard, AdminProducts, ProductForm,
                              BulkImport, AdminOrders
  styles/index.css          → all styling, one file, plain CSS
```
