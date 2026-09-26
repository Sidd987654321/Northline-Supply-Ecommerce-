import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { token, user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    if (!token) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const data = await api.getWishlist(token);
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Reload the wishlist whenever the logged-in user changes
  useEffect(() => {
    refresh();
  }, [user?._id]);

  const isWishlisted = (productId) => items.some((p) => p._id === productId);

  const toggleWishlist = async (product) => {
    if (!token) return { needsLogin: true };
    if (isWishlisted(product._id)) {
      setItems((prev) => prev.filter((p) => p._id !== product._id));
      await api.removeFromWishlist(product._id, token);
    } else {
      setItems((prev) => [...prev, product]);
      await api.addToWishlist(product._id, token);
    }
    return { needsLogin: false };
  };

  const value = { items, loading, isWishlisted, toggleWishlist, refresh };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
