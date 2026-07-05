"use client";

import { useEffect, useState, useMemo } from "react";
import {
  IndianRupee, Wallet, TrendingDown, TrendingUp,
  ChevronDown, ChevronUp, Check, X, Plus, Trash2, Loader2,
  Users, Save, Pencil,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Person {
  name: string;
  idProofUrl?: string;
  age?: number;
  gender?: string;
}
interface TrekOrder {
  id: string;
  trekId: string;
  trekName: string;
  userName: string;
  userEmail: string;
  totalAmount: number;
  advancePaid: number;
  remainingCash: number;
   paymentType: "full" | "advance" | "offline";
  cashCollected: boolean;
  persons: Person[];
  createdAt: string;
  status: string;
   offlineVerified?: boolean;
}
interface Trek {
  id: string;
  name: string;
  ledgerNotes?: string;
}
interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  trekId: string | null;
  trekName: string | null;
  date: string;
}

const EXPENSE_CATEGORIES = ["guide", "food", "transport", "equipment", "marketing", "misc", "general"];

// ── Helpers ───────────────────────────────────────────────────────────────────
const inr = (n: number) => `₹${(n || 0).toLocaleString("en-IN")}`;

// ── Main page ────────────────────────────────────────────────────────────────
export default function AdminFinancePage() {
  const [orders, setOrders]     = useState<TrekOrder[]>([]);
  const [treks, setTreks]       = useState<Trek[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading]   = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
  const [savingNotes, setSavingNotes] = useState<Record<string, boolean>>({});
  const [markingCollected, setMarkingCollected] = useState<Record<string, boolean>>({});

  // Edit / delete order state
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<{ totalAmount: string; advancePaid: string; remainingCash: string }>({
    totalAmount: "", advancePaid: "", remainingCash: "",
  });
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);

  // ID proof expansion state
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Expense form
  const [expDesc, setExpDesc]         = useState("");
  const [expAmount, setExpAmount]     = useState("");
  const [expCategory, setExpCategory] = useState("general");
  const [expTrekId, setExpTrekId]     = useState("");
  const [expSaving, setExpSaving]     = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    const [ordersRes, treksRes, expensesRes] = await Promise.all([
      fetch("/api/orders?orderType=trek"),
      fetch("/api/treks?all=true"),
      fetch("/api/expenses"),
    ]);
    const [ordersData, treksData, expensesData] = await Promise.all([
      ordersRes.json(), treksRes.json(), expensesRes.json(),
    ]);
setOrders(Array.isArray(ordersData) ? ordersData.filter((o: TrekOrder) => o.status !== "pending") : []);
setTreks(Array.isArray(treksData) ? treksData : []);    setNotesDraft(
      Object.fromEntries((Array.isArray(treksData) ? treksData : []).map((t: Trek) => [t.id, t.ledgerNotes ?? ""]))
    );
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  // ── Group orders by trek ────────────────────────────────────────────────────
  const trekLedger = useMemo(() => {
    return treks.map((trek) => {
      const trekOrders = orders.filter((o) => o.trekId === trek.id);
      const totalRegistrations = trekOrders.reduce((sum, o) => sum + (o.persons?.length || 0), 0);
      const totalBookingValue  = trekOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      const totalCollected = trekOrders.reduce((sum, o) => {
        const paid = o.advancePaid ?? o.totalAmount ?? 0;
        const cash = o.cashCollected ? (o.remainingCash || 0) : 0;
        return sum + paid + cash;
      }, 0);
      const totalRemaining = trekOrders.reduce(
        (sum, o) => sum + (o.cashCollected ? 0 : (o.remainingCash || 0)), 0
      );
      const trekExpenses = expenses.filter((e) => e.trekId === trek.id);
      const totalExpenses = trekExpenses.reduce((sum, e) => sum + e.amount, 0);

      return {
        trek, trekOrders, totalRegistrations, totalBookingValue,
        totalCollected, totalRemaining, trekExpenses, totalExpenses,
      };
    }).filter((t) => t.trekOrders.length > 0 || t.trekExpenses.length > 0);
  }, [treks, orders, expenses]);

  // ── Overall summary ─────────────────────────────────────────────────────────
  const summary = useMemo(() => {
    const totalCollected = trekLedger.reduce((sum, t) => sum + t.totalCollected, 0);
    const totalRemaining = trekLedger.reduce((sum, t) => sum + t.totalRemaining, 0);
    const generalExpenses = expenses.filter((e) => !e.trekId).reduce((sum, e) => sum + e.amount, 0);
    const trekExpensesTotal = trekLedger.reduce((sum, t) => sum + t.totalExpenses, 0);
    const totalExpenses = generalExpenses + trekExpensesTotal;
    const netProfit = totalCollected - totalExpenses;
    return { totalCollected, totalRemaining, totalExpenses, netProfit };
  }, [trekLedger, expenses]);

  // ── Actions ──────────────────────────────────────────────────────────────────
  const toggleExpand = (id: string) => setExpanded((s) => ({ ...s, [id]: !s[id] }));

  const markCashCollected = async (orderId: string) => {
    setMarkingCollected((s) => ({ ...s, [orderId]: true }));
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: orderId, cashCollected: true }),
    });
    await fetchAll();
    setMarkingCollected((s) => ({ ...s, [orderId]: false }));
  };

  const verifyOfflinePayment = async (orderId: string, totalAmount: number) => {
  setMarkingCollected((s) => ({ ...s, [orderId]: true }));
  await fetch("/api/orders", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: orderId,
      offlineVerified: true,
      paymentVerified: true,
      status: "confirmed",
      cashCollected: true,
      advancePaid: totalAmount,
      remainingCash: 0,
    }),
  });
  await fetchAll();
  setMarkingCollected((s) => ({ ...s, [orderId]: false }));
};

  // ── Edit / delete order handlers ────────────────────────────────────────────
  const startEditOrder = (o: TrekOrder) => {
    setEditingOrderId(o.id);
    setEditDraft({
      totalAmount: String(o.totalAmount ?? 0),
      advancePaid: String(o.advancePaid ?? 0),
      remainingCash: String(o.remainingCash ?? 0),
    });
  };

  const cancelEditOrder = () => {
    setEditingOrderId(null);
  };

  const saveEditOrder = async (orderId: string) => {
    setSavingEdit(true);
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: orderId,
        totalAmount: Number(editDraft.totalAmount) || 0,
        advancePaid: Number(editDraft.advancePaid) || 0,
        remainingCash: Number(editDraft.remainingCash) || 0,
      }),
    });
    setSavingEdit(false);
    setEditingOrderId(null);
    fetchAll();
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm("Delete this booking entry permanently? This cannot be undone.")) return;
    setDeletingOrderId(orderId);
    await fetch("/api/orders", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: orderId }),
    });
    await fetchAll();
    setDeletingOrderId(null);
  };

  const saveNotes = async (trekId: string) => {
    setSavingNotes((s) => ({ ...s, [trekId]: true }));
    await fetch("/api/treks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: trekId, ledgerNotes: notesDraft[trekId] ?? "" }),
    });
    setSavingNotes((s) => ({ ...s, [trekId]: false }));
  };

  const addExpense = async () => {
    if (!expDesc.trim() || !expAmount || Number(expAmount) <= 0) return;
    setExpSaving(true);
    const chosenTrek = treks.find((t) => t.id === expTrekId);
    await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: expDesc.trim(),
        amount: Number(expAmount),
        category: expCategory,
        trekId: expTrekId || null,
        trekName: chosenTrek?.name || null,
      }),
    });
    setExpDesc(""); setExpAmount(""); setExpCategory("general"); setExpTrekId("");
    setExpSaving(false);
    fetchAll();
  };

  const deleteExpense = async (id: string) => {
    if (!confirm("Delete this expense?")) return;
    await fetch("/api/expenses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchAll();
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-kokan-green" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-kokan-earth">💰 Finance</h1>
        <p className="text-sm text-gray-500 mt-0.5">Trek collections, pending cash & expenses</p>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            <IndianRupee size={12} /> Collected
          </div>
          <p className="text-xl font-bold text-kokan-green">{inr(summary.totalCollected)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            <Wallet size={12} /> Cash Pending
          </div>
          <p className="text-xl font-bold text-amber-600">{inr(summary.totalRemaining)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            <TrendingDown size={12} /> Expenses
          </div>
          <p className="text-xl font-bold text-red-500">{inr(summary.totalExpenses)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            <TrendingUp size={12} /> Net Profit
          </div>
          <p className={`text-xl font-bold ${summary.netProfit >= 0 ? "text-kokan-green" : "text-red-500"}`}>
            {inr(summary.netProfit)}
          </p>
        </div>
      </div>

      {/* ── Trek ledger ── */}
      <div>
        <h2 className="font-bold text-kokan-earth mb-3">Trek Ledger</h2>
        {trekLedger.length === 0 ? (
          <div className="text-center py-10 text-gray-400 bg-white rounded-2xl border border-gray-200">
            No trek registrations yet.
          </div>
        ) : (
          <div className="space-y-3">
            {trekLedger.map(({ trek, trekOrders, totalRegistrations, totalBookingValue, totalCollected, totalRemaining, trekExpenses, totalExpenses }) => (
              <div key={trek.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleExpand(trek.id)}
                  className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors text-left"
                >
                  <div>
                    <p className="font-bold text-kokan-earth text-sm">{trek.name}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Users size={11} /> {totalRegistrations} registered
                      </span>
                      <span className="text-xs text-gray-400">· Value {inr(totalBookingValue)}</span>
                      <span className="text-xs font-semibold text-kokan-green">Collected {inr(totalCollected)}</span>
                      {totalRemaining > 0 && (
                        <span className="text-xs font-semibold text-amber-600">Pending {inr(totalRemaining)}</span>
                      )}
                      {totalExpenses > 0 && (
                        <span className="text-xs font-semibold text-red-500">Expenses {inr(totalExpenses)}</span>
                      )}
                    </div>
                  </div>
                  {expanded[trek.id] ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
                </button>

                {expanded[trek.id] && (
                  <div className="border-t border-gray-100 px-4 py-4 space-y-4 bg-gray-50/50">

                    {/* Registrations */}
                    <div className="space-y-2">
                      {trekOrders.map((o) => (
                        <div key={o.id} className="bg-white rounded-xl p-3 border border-gray-100">
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-kokan-earth truncate">{o.userName}</p>
                              <p className="text-xs text-gray-400">
                                {o.persons?.length || 0} person(s) · {new Date(o.createdAt).toLocaleDateString("en-IN")}
                              </p>
                              <button
                                onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}
                                className="text-[10px] text-kokan-green font-semibold hover:underline mt-1"
                              >
                                {expandedOrder === o.id ? "Hide" : "View"} ID proofs ({o.persons?.length || 0})
                              </button>
                            </div>

                            {editingOrderId !== o.id && (
                              <div className="text-right flex-shrink-0">
                                <p className="text-xs text-gray-500">
                                  {o.paymentType === "offline" ? "To collect" : "Paid"} {inr(o.paymentType === "offline" ? o.totalAmount : (o.advancePaid ?? o.totalAmount))}
                                </p>

                                <div className="flex items-center gap-1 mt-1 justify-end">
                                  {o.paymentType === "advance" && !o.cashCollected && (
                                    <button
                                      onClick={() => markCashCollected(o.id)}
                                      disabled={markingCollected[o.id]}
                                      className="text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg hover:bg-amber-100 transition-colors disabled:opacity-50"
                                    >
                                      {markingCollected[o.id]
                                        ? <Loader2 size={11} className="animate-spin inline" />
                                        : `Collect ${inr(o.remainingCash)}`}
                                    </button>
                                  )}
                                  {o.paymentType === "advance" && o.cashCollected && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-kokan-green">
                                      <Check size={11} /> Cash collected
                                    </span>
                                  )}

                                  {o.paymentType === "offline" && !o.offlineVerified && (
                                    <button
                                      onClick={() => verifyOfflinePayment(o.id, o.totalAmount)}
                                      disabled={markingCollected[o.id]}
                                      className="text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-1 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                                    >
                                      {markingCollected[o.id]
                                        ? <Loader2 size={11} className="animate-spin inline" />
                                        : "Verify Payment"}
                                    </button>
                                  )}
                                  {o.paymentType === "offline" && o.offlineVerified && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-kokan-green">
                                      <Check size={11} /> Verified
                                    </span>
                                  )}

                                  <button
                                    onClick={() => startEditOrder(o)}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-kokan-green hover:bg-kokan-green/5 transition-colors"
                                    title="Edit amounts"
                                  >
                                    <Pencil size={13} />
                                  </button>
                                  <button
                                    onClick={() => deleteOrder(o.id)}
                                    disabled={deletingOrderId === o.id}
                                    className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                                    title="Delete entry"
                                  >
                                    {deletingOrderId === o.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {expandedOrder === o.id && (
                            <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {o.persons?.map((p, i) => (
                                <a
                                  key={i}
                                  href={p.idProofUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block group"
                                >
                                  <div className="relative w-full h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                    {p.idProofUrl ? (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img src={p.idProofUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No ID</div>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-gray-500 mt-1 truncate">{p.name}</p>
                                </a>
                              ))}
                            </div>
                          )}

                          {editingOrderId === o.id && (
                            <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                              <div className="grid grid-cols-3 gap-2">
                                <div>
                                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total</label>
                                  <input
                                    type="number" min="0"
                                    value={editDraft.totalAmount}
                                    onChange={(e) => setEditDraft((d) => ({ ...d, totalAmount: e.target.value }))}
                                    className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Paid</label>
                                  <input
                                    type="number" min="0"
                                    value={editDraft.advancePaid}
                                    onChange={(e) => setEditDraft((d) => ({ ...d, advancePaid: e.target.value }))}
                                    className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Remaining</label>
                                  <input
                                    type="number" min="0"
                                    value={editDraft.remainingCash}
                                    onChange={(e) => setEditDraft((d) => ({ ...d, remainingCash: e.target.value }))}
                                    className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                                  />
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => saveEditOrder(o.id)}
                                  disabled={savingEdit}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-kokan-green text-white rounded-lg text-xs font-bold hover:bg-kokan-green/90 disabled:opacity-60"
                                >
                                  {savingEdit ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Save
                                </button>
                                <button
                                  onClick={cancelEditOrder}
                                  disabled={savingEdit}
                                  className="px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-50"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Per-trek expenses */}
                    {trekExpenses.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Expenses</p>
                        {trekExpenses.map((e) => (
                          <div key={e.id} className="flex items-center justify-between text-sm bg-white rounded-lg px-3 py-2 border border-gray-100">
                            <span className="text-kokan-earth">{e.description} <span className="text-gray-400 text-xs capitalize">({e.category})</span></span>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-red-500">{inr(e.amount)}</span>
                              <button onClick={() => deleteExpense(e.id)} className="text-gray-300 hover:text-red-400">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Notes */}
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Notes / Manual Adjustments</p>
                      <div className="flex gap-2">
                        <textarea
                          value={notesDraft[trek.id] ?? ""}
                          onChange={(e) => setNotesDraft((s) => ({ ...s, [trek.id]: e.target.value }))}
                          rows={2}
                          placeholder="e.g. ₹500 discount given in cash to Rohan, not reflected above"
                          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-kokan-green/30 bg-white"
                        />
                        <button
                          onClick={() => saveNotes(trek.id)}
                          disabled={savingNotes[trek.id]}
                          className="px-3 py-2 bg-kokan-green text-white rounded-lg text-xs font-bold hover:bg-kokan-green/90 disabled:opacity-60 flex items-center gap-1 self-start"
                        >
                          {savingNotes[trek.id] ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Expense tracker ── */}
      <div>
        <h2 className="font-bold text-kokan-earth mb-3">Add Expense</h2>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              value={expDesc}
              onChange={(e) => setExpDesc(e.target.value)}
              placeholder="Description e.g. Guide fees for Vijaydurg trek"
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
            />
            <input
              type="number" min="0"
              value={expAmount}
              onChange={(e) => setExpAmount(e.target.value)}
              placeholder="Amount (₹)"
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={expCategory}
              onChange={(e) => setExpCategory(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
            >
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
            <select
              value={expTrekId}
              onChange={(e) => setExpTrekId(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
            >
              <option value="">General (not trek-specific)</option>
              {treks.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <button
            onClick={addExpense}
            disabled={expSaving || !expDesc.trim() || !expAmount}
            className="flex items-center gap-2 px-5 py-2.5 bg-kokan-green text-white rounded-xl font-bold text-sm hover:bg-kokan-green/90 disabled:opacity-60 transition-colors"
          >
            {expSaving ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />} Add Expense
          </button>
        </div>

        {/* General expenses list */}
        {expenses.filter((e) => !e.trekId).length > 0 && (
          <div className="mt-3 bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
            {expenses.filter((e) => !e.trekId).map((e) => (
              <div key={e.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm text-kokan-earth font-medium">{e.description}</p>
                  <p className="text-xs text-gray-400 capitalize">{e.category} · {new Date(e.date).toLocaleDateString("en-IN")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-red-500 text-sm">{inr(e.amount)}</span>
                  <button onClick={() => deleteExpense(e.id)} className="text-gray-300 hover:text-red-400">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}