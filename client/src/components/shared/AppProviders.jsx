"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const CartWishlistContext = createContext(null);

export function AppProviders({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((l) => l.product.id === product.id);
      if (idx === -1) return [...prev, { product, quantity }];
      const next = [...prev];
      next[idx] = {
        ...next[idx],
        quantity: next[idx].quantity + quantity,
      };
      return next;
    });
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) => prev.filter((l) => l.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    setCartItems((prev) =>
      prev
        .map((l) =>
          l.product.id === productId ? { ...l, quantity: Math.max(1, quantity) } : l,
        )
        .filter((l) => l.quantity > 0),
    );
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const toggleWishlist = useCallback((productId) => {
    setWishlistIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    );
  }, []);

  const isInWishlist = useCallback(
    (productId) => wishlistIds.includes(productId),
    [wishlistIds],
  );

  const subtotal = useMemo(
    () => cartItems.reduce((sum, l) => sum + l.product.price * l.quantity, 0),
    [cartItems],
  );

  const value = useMemo(
    () => ({
      cartItems,
      wishlistIds,
      cartOpen,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      subtotal,
      toggleWishlist,
      isInWishlist,
    }),
    [
      cartItems,
      wishlistIds,
      cartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      subtotal,
      toggleWishlist,
      isInWishlist,
    ],
  );

  return (
    <CartWishlistContext.Provider value={value}>{children}</CartWishlistContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(CartWishlistContext);
  if (!ctx) throw new Error("useShop must be used within AppProviders");
  return ctx;
}
