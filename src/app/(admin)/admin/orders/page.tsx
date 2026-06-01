"use client";

import { useEffect, useState } from "react";
import { Order, OrderStatus } from "@/types/order";
import { Package, Truck, CheckCircle, Clock, X, ChevronDown } from "lucide-react";

const STATUS_OPTIONS: { value: OrderStatus; label: string; color: string }[] = [
  { value: "pending", label: "Pending", color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
  { value: "confirmed", label: "Confirmed", color: "text-blue-600 bg-blue-50 border-blue-200" },
  { value: "out_for_delivery", label: "Out for Delivery", color: "text-orange-600 bg-orange-50 border-orange-200" },
  { value: "delivered", label: "Delivered", color: "text-green-600 bg-green-50 border-green-200" },
  { value: "cancelled", label: "Cancelled", color: "text-red-500 bg-red-50 border-red-200" },
];

const statusIcon = {
  pending: <Clock className="w-4 h-4" />,
  confirmed: <CheckCircle className="w-4 h-4" />,
  out_for_delivery: <Truck className="w-4 h-4" />,
  delivered: <CheckCircle className="w-4 h-4" />,
  cancelled: <X className="w-4 h-4" />,
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"all" | OrderStatus>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []); // ← guard
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: OrderStatus) => {
    setActionLoading(id);
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    setActionLoading(null);
  };

  const filtered = tab === "all" ? orders : orders.filter((o) => o.status === tab);

  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s.value] = orders.filter((o) => o.status === s.value).length;
    return acc;
  }, {} as Record<OrderStatus, number>);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-white text-xl font-semibold">Orders</h1>
        <p className="text-white/30 text-sm mt-0.5">{orders.length} total orders</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setTab("all")}
          className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${tab === "all" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"}`}
        >
          All ({orders.length})
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s.value}
            onClick={() => setTab(s.value)}
            className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${tab === s.value ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"}`}
          >
            {s.label} ({counts[s.value] ?? 0})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#141414] border border-white/5 rounded-xl h-24 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#141414] border border-white/5 rounded-xl p-12 text-center">
          <Package className="w-10 h-10 text-white/10 mx-auto mb-3" />
          <p className="text-white/25 text-sm">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const statusCfg = STATUS_OPTIONS.find((s) => s.value === order.status);
            return (
              <div key={order.id} className="bg-[#141414] border border-white/5 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white/80 font-medium text-sm">
                        {order.orderType === "trek" ? `🧗 ${order.trekName}` : `📦 ${order.items?.length} product(s)`}
                      </span>
                      <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${statusCfg?.color}`}>
                        {statusIcon[order.status]} {statusCfg?.label}
                      </span>
                    </div>
                    <p className="text-white/35 text-xs">{order.userName} · {order.userEmail}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-[#2ecc71] font-semibold text-sm">
                        ₹{order.totalAmount.toLocaleString("en-IN")}
                      </span>
                      <span className="text-white/25 text-xs">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      {order.orderType === "trek" && (
                        <span className="text-white/25 text-xs">📅 {order.trekDate} · {order.persons?.length} person(s)</span>
                      )}
                      {order.orderType === "product" && order.deliveryAddress && (
                        <span className="text-white/25 text-xs">📍 {order.deliveryAddress.city}</span>
                      )}
                    </div>
                  </div>

                  {/* Status updater */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                        disabled={actionLoading === order.id}
                        className="appearance-none bg-white/5 border border-white/10 text-white/60 text-xs rounded-lg px-3 py-1.5 pr-7 focus:outline-none focus:border-[#2ecc71]/30 cursor-pointer disabled:opacity-50"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s.value} value={s.value} className="bg-[#141414]">
                            {s.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Product items preview */}
                {order.orderType === "product" && order.items && (
                  <div className="mt-3 pt-3 border-t border-white/5 flex gap-2 flex-wrap">
                    {order.items.map((item, i) => (
                      <span key={i} className="text-xs bg-white/5 text-white/40 px-2 py-1 rounded-lg">
                        {item.name} × {item.quantity}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}