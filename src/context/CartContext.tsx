"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartItem, Product } from "@/types/product";

interface CartContextType {
  items: CartItem[];
  hydrated: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_KEY = "kokan_cart";

function saveToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {}
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems]       = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage once on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setHydrated(true);
  }, []);

  // Persist on every change — but only after hydration
  // (safety net — direct writes in mutators are the primary path)
  useEffect(() => {
    if (!hydrated) return;
    saveToStorage(items);
  }, [items, hydrated]);

  const addToCart = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      const next = existing
        ? prev.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + quantity }
              : i
          )
        : [...prev, { product, quantity }];

      // Write immediately — don't wait for useEffect
      // This ensures the cart is in localStorage before any router.push
      saveToStorage(next);
      return next;
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.product.id !== productId);
      saveToStorage(next);
      return next;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(productId); return; }
    setItems((prev) => {
      const next = prev.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      );
      saveToStorage(next);
      return next;
    });
  };

  const clearCart = () => {
    setItems([]);
    saveToStorage([]);
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const isInCart   = (productId: string) => items.some((i) => i.product.id === productId);

  return (
    <CartContext.Provider value={{
      items, hydrated,
      addToCart, removeFromCart, updateQuantity, clearCart,
      totalItems, totalPrice, isInCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}