"use client";

import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleCheckout = () => {
    if (!user) {
      onClose();
      router.push("/login");
      return;
    }
    // checkout flow will be added in booking step
    router.push("/checkout");
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-kokan-sand">
          <h2 className="text-lg font-semibold text-kokan-earth font-playfair">
            Your Cart
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-kokan-sand/20 transition-colors"
          >
            <X className="w-5 h-5 text-kokan-earth" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <ShoppingBag className="w-16 h-16 text-kokan-sand" />
              <p className="text-kokan-earth/60 font-medium">Your cart is empty</p>
              <button
                onClick={() => { onClose(); router.push("/products"); }}
                className="text-kokan-green underline text-sm"
              >
                Browse Products
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3 bg-kokan-cream/40 rounded-xl p-3"
              >
                {/* Image */}
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-kokan-sand/30">
                  {item.product.images?.[0] ? (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      🥭
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-kokan-earth text-sm truncate">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-kokan-earth/50 mt-0.5">
                    {item.product.unit}
                  </p>
                  <p className="text-kokan-green font-semibold text-sm mt-1">
                    ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                  </p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full bg-kokan-sand/40 flex items-center justify-center hover:bg-kokan-sand transition-colors"
                    >
                      <Minus className="w-3 h-3 text-kokan-earth" />
                    </button>
                    <span className="text-sm font-medium w-5 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full bg-kokan-sand/40 flex items-center justify-center hover:bg-kokan-sand transition-colors"
                    >
                      <Plus className="w-3 h-3 text-kokan-earth" />
                    </button>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="p-1.5 rounded-full hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors self-start"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-kokan-sand px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-kokan-earth/70 text-sm">Total</span>
              <span className="text-kokan-earth font-bold text-lg">
                ₹{totalPrice.toLocaleString("en-IN")}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-kokan-green text-white py-3 rounded-xl font-semibold hover:bg-kokan-green/90 transition-colors"
            >
              {user ? "Proceed to Checkout" : "Login to Checkout"}
            </button>
            <button
              onClick={clearCart}
              className="w-full text-red-400 text-sm hover:text-red-600 transition-colors"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}