"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ToastContainer, toast } from "react-toastify";

const CartWishlistContext = createContext(null);
const AUTH_STORAGE_KEY = "verdant_auth_user";

export function AppProviders({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const cartItemsRef = useRef([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!saved) return;
    try {
      setAuthUser(JSON.parse(saved));
    } catch {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    cartItemsRef.current = cartItems;
  }, [cartItems]);

  const addToCart = useCallback((product, quantity = 1) => {
    const existing = cartItemsRef.current.find((line) => line.product.id === product.id);
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
    if (existing) {
      toast.success(`${product.name} quantity updated in cart.`);
      return;
    }
    toast.success(`${product.name} added to cart.`);
  }, []);

  const removeFromCart = useCallback((productId, options = {}) => {
    const existing = cartItemsRef.current.find((line) => line.product.id === productId);
    if (!existing) return;
    setCartItems((prev) => prev.filter((l) => l.product.id !== productId));
    if (options.notify === false) return;
    toast.info(`${existing.product.name} removed from cart.`);
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

  const clearCart = useCallback(() => {
    if (!cartItemsRef.current.length) return;
    setCartItems([]);
    toast.info("Cart cleared.");
  }, []);

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

  const registerUser = useCallback(({ name, email }) => {
    const user = {
      id: `user-${Date.now()}`,
      name,
      email,
      createdAt: new Date().toISOString(),
    };
    setAuthUser(user);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    }
    return user;
  }, []);

  const loginUser = useCallback(({ email }) => {
    const existing = typeof window !== "undefined" ? window.localStorage.getItem(AUTH_STORAGE_KEY) : null;
    let user = null;
    if (existing) {
      try {
        user = JSON.parse(existing);
      } catch {
        user = null;
      }
    }
    if (!user) {
      user = {
        id: `user-${Date.now()}`,
        name: email.split("@")[0],
        email,
        createdAt: new Date().toISOString(),
      };
    } else {
      user = { ...user, email };
    }
    setAuthUser(user);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    }
    return user;
  }, []);

  const logoutUser = useCallback(() => {
    setAuthUser(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

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
      authUser,
      isAuthenticated: Boolean(authUser),
      registerUser,
      loginUser,
      logoutUser,
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
      authUser,
      registerUser,
      loginUser,
      logoutUser,
    ],
  );

  return (
    <CartWishlistContext.Provider value={value}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={2200}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </CartWishlistContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(CartWishlistContext);
  if (!ctx) throw new Error("useShop must be used within AppProviders");
  return ctx;
}
