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
import { login, signup, fetchProfile, refreshToken, logout } from "@/services/auth";

const CartWishlistContext = createContext(null);
const AUTH_STORAGE_KEY = "verdant_auth_user";
const AUTH_TOKEN_KEY = "verdant_auth_token";

export function AppProviders({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const cartItemsRef = useRef([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(AUTH_STORAGE_KEY);
    const savedToken = window.localStorage.getItem(AUTH_TOKEN_KEY);
    if (saved) {
      try {
        setAuthUser(JSON.parse(saved));
      } catch {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    if (savedToken) {
      setAuthToken(savedToken);
    }

    const initializeAuth = async () => {
      try {
        const profileResponse = await fetchProfile();
        const user = profileResponse?.data;
        if (user) {
          setAuthUser(user);
          window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        }
      } catch (error) {
        const message = error?.message?.toString() || "";
        if (message.includes("Invalid") || message.includes("Unauthorized") || message.includes("login")) {
          try {
            await refreshToken();
            const profileResponse = await fetchProfile();
            const user = profileResponse?.data;
            if (user) {
              setAuthUser(user);
              window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
            }
          } catch {
            setAuthUser(null);
            setAuthToken(null);
            window.localStorage.removeItem(AUTH_STORAGE_KEY);
            window.localStorage.removeItem(AUTH_TOKEN_KEY);
          }
        } else {
          setAuthUser(null);
          setAuthToken(null);
          window.localStorage.removeItem(AUTH_STORAGE_KEY);
          window.localStorage.removeItem(AUTH_TOKEN_KEY);
        }
      } finally {
        setAuthLoaded(true);
      }
    };

    initializeAuth();
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

  const registerUser = useCallback(async ({ name, email, password }) => {
    const response = await signup({
      fullName: name,
      email,
      password,
    });
    return response;
  }, []);

  const loginUser = useCallback(async ({ email, password }) => {
    const response = await login({ email, password });
    let user = response?.data?.user ?? {
      name: email.split("@")[0],
      email,
      id: `user-${Date.now()}`,
    };
    if (user && user.role && typeof user.role === "string") {
      user.role = user.role.toLowerCase();
    }
    const token = response?.data?.accessToken;
    setAuthUser(user);
    setAuthToken(token || null);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      if (token) {
        window.localStorage.setItem(AUTH_TOKEN_KEY, token);
      }
    }
    return user;
  }, []);

  const logoutUser = useCallback(async () => {
    try {
      await logout();
    } catch {
      // fallback: clear auth state even if logout endpoint fails
    }
    setAuthUser(null);
    setAuthToken(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
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
      authLoaded,
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
      authLoaded,
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
