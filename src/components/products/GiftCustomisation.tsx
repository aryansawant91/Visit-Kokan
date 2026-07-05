"use client";

import { useState } from "react";
import { Gift, ChevronDown, ChevronUp, Package, MessageSquare } from "lucide-react";

export interface GiftOptions {
  isGift: boolean;
  recipientName: string;
  message: string;
  boxType: "none" | "basic" | "premium";
}

interface Props {
  onChange: (opts: GiftOptions) => void;
}

const BOX_OPTIONS = [
  { value: "none",    label: "No gift box",    price: 0,  desc: "Standard packaging"          },
  { value: "basic",   label: "Basic Gift Box", price: 49, desc: "Ribbon + tissue wrap"         },
  { value: "premium", label: "Premium Box",    price: 99, desc: "Luxury box + personalised tag"},
] as const;

export default function GiftCustomisation({ onChange }: Props) {
  const [open, setOpen]     = useState(false);
  const [opts, setOpts]     = useState<GiftOptions>({
    isGift: false, recipientName: "", message: "", boxType: "none",
  });

  const update = (patch: Partial<GiftOptions>) => {
    const next = { ...opts, ...patch };
    setOpts(next);
    onChange(next);
  };

  const selectedBox = BOX_OPTIONS.find(b => b.value === opts.boxType)!;

  return (
    <div className="border border-kokan-sand/40 rounded-2xl overflow-hidden bg-white">

      {/* Header toggle */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-kokan-cream/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
            opts.isGift ? "bg-pink-100" : "bg-kokan-cream/60"
          }`}>
            <Gift size={17} className={opts.isGift ? "text-pink-500" : "text-kokan-earth/40"} />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-kokan-earth">
              {opts.isGift ? "Gift options added 🎁" : "Add gift customisation"}
            </p>
            {opts.isGift && opts.boxType !== "none" && (
              <p className="text-xs text-kokan-earth/50 mt-0.5">
                {selectedBox.label} · +₹{selectedBox.price}
              </p>
            )}
          </div>
        </div>
        {open
          ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" />
          : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
      </button>

      {open && (
        <div className="border-t border-kokan-sand/30 px-4 py-4 space-y-4">

          {/* Is gift toggle */}
          <label className="flex items-center justify-between cursor-pointer select-none">
            <div>
              <p className="text-sm font-semibold text-kokan-earth">This is a gift</p>
              <p className="text-xs text-kokan-earth/50 mt-0.5">Add personal touch for the recipient</p>
            </div>
            <div
              onClick={() => update({ isGift: !opts.isGift })}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                opts.isGift ? "bg-kokan-green" : "bg-gray-200"
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                opts.isGift ? "left-6" : "left-1"
              }`} />
            </div>
          </label>

          {opts.isGift && (
            <>
              {/* Recipient name */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Recipient&apos;s Name
                </label>
                <input
                  value={opts.recipientName}
                  onChange={e => update({ recipientName: e.target.value })}
                  placeholder="e.g. Priya Sawant"
                  maxLength={50}
                  className="w-full px-3 py-2.5 rounded-xl border border-kokan-sand text-sm text-kokan-earth focus:outline-none focus:ring-2 focus:ring-kokan-green/30 bg-kokan-cream/20"
                />
              </div>

              {/* Personal message */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Personal Message
                  </label>
                  <span className="text-[10px] text-gray-400">{opts.message.length}/100</span>
                </div>
                <textarea
                  value={opts.message}
                  onChange={e => update({ message: e.target.value.slice(0, 100) })}
                  placeholder="Write a heartfelt message..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-kokan-sand text-sm text-kokan-earth resize-none focus:outline-none focus:ring-2 focus:ring-kokan-green/30 bg-kokan-cream/20"
                />
              </div>

              {/* Gift box selection */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Gift Packaging
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {BOX_OPTIONS.map(box => (
                    <button
                      key={box.value}
                      onClick={() => update({ boxType: box.value })}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        opts.boxType === box.value
                          ? "border-kokan-green bg-kokan-green/5"
                          : "border-kokan-sand/40 hover:border-kokan-green/30"
                      }`}
                    >
                      <div className="text-lg mb-1">
                        {box.value === "none" ? "📦" : box.value === "basic" ? "🎀" : "🎁"}
                      </div>
                      <p className="text-xs font-bold text-kokan-earth leading-tight">{box.label}</p>
                      <p className="text-[10px] text-kokan-earth/50 mt-0.5">{box.desc}</p>
                      {box.price > 0 && (
                        <p className="text-xs font-bold text-kokan-green mt-1">+₹{box.price}</p>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview card */}
              {(opts.recipientName || opts.message) && (
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-pink-400 uppercase tracking-wider mb-2">Gift card preview</p>
                  {opts.recipientName && (
                    <p className="text-sm text-kokan-earth font-semibold">To: {opts.recipientName}</p>
                  )}
                  {opts.message && (
                    <p className="text-sm text-kokan-earth/70 mt-1 italic leading-relaxed">&quot;{opts.message}&quot;</p>
                  )}
                  <p className="text-xs text-kokan-earth/40 mt-2">— From Visit Kokan 🌿</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}