"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import CartDrawer from "./CartDrawer";

export default function CartIcon() {
  const { totalItems } = useCart();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative p-2 rounded-full hover:bg-kokan-sand/20 transition-colors"
        aria-label="Open cart"
      >
        <ShoppingCart className="w-6 h-6 text-kokan-earth" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-kokan-green text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {totalItems > 99 ? "99+" : totalItems}
          </span>
        )}
      </button>

      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}