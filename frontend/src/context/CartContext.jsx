import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "ns_cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // A cart "line" is identified by productId + size
  const addToCart = (product, size, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === product._id && i.size === size
      );
      if (existing) {
        return prev.map((i) =>
          i.productId === product._id && i.size === size
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          title: product.title,
          image: product.images?.[0],
          price: product.price,
          size,
          quantity,
        },
      ];
    });
  };

  const updateQuantity = (productId, size, quantity) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.size === size ? { ...i, quantity } : i
      )
    );
  };

  const removeFromCart = (productId, size) => {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.size === size))
    );
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const value = {
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    totalCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
