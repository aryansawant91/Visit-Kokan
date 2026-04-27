"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Calendar, Users, IndianRupee, Phone } from "lucide-react";

interface Props {
  listingName: string;
  price?: number;
  priceUnit?: string;
  phone?: string;
  category: string;
}

export default function BookingWidget({ listingName, price, priceUnit, phone, category }: Props) {
  const { user } = useAuth();
  const router   = useRouter();
  const [persons, setPersons] = useState(1);
  const [date, setDate]       = useState("");

  const isAccommodation = ["homestay", "hotel"].includes(category);
  const total = (price ?? 0) * persons;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const handleBook = () => {
    if (!user) { router.push("/login"); return; }
    alert(`Booking coming soon! ${listingName} — ${persons} person(s) on ${date}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 sticky top-24">
      {price ? (
        <div className="mb-5">
          <p className="text-gray-400 text-sm">Starting from</p>
          <div className="flex items-end gap-1">
            <span className="text-3xl font-bold text-kokan-earth">
              ₹{price.toLocaleString("en-IN")}
            </span>
            <span className="text-gray-400 text-sm mb-1">
              /{priceUnit?.replace("per ", "")}
            </span>
          </div>
        </div>
      ) : (
        <p className="text-kokan-earth font-semibold mb-5">Price on request</p>
      )}

      <div className="space-y-3">
        {isAccommodation && (
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1.5">
              <Calendar size={14} /> Check-in Date
            </label>
            <input
              type="date"
              min={minDate}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
            />
          </div>
        )}

        {price && (
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1.5">
              <Users size={14} /> Guests
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPersons((p) => Math.max(1, p - 1))}
                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-lg hover:bg-gray-50"
              >−</button>
              <span className="text-lg font-semibold text-kokan-earth w-8 text-center">{persons}</span>
              <button
                onClick={() => setPersons((p) => p + 1)}
                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-lg hover:bg-gray-50"
              >+</button>
            </div>
          </div>
        )}

        {price && (
          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <span className="text-sm font-medium text-gray-600">Total</span>
            <span className="text-lg font-bold text-kokan-earth flex items-center gap-1">
              <IndianRupee size={16} /> {total.toLocaleString("en-IN")}
            </span>
          </div>
        )}

        <button
          onClick={handleBook}
          className="w-full bg-kokan-green text-white py-3.5 rounded-xl font-semibold hover:bg-kokan-green/90 transition-colors"
        >
          {user ? "Book Now" : "Login to Book"}
        </button>

        {phone && (
          <a
            href={`tel:${phone}`}
            className="flex items-center justify-center gap-2 w-full py-3 border border-kokan-green text-kokan-green rounded-xl font-semibold hover:bg-kokan-green/5 transition-colors text-sm"
          >
            <Phone size={15} /> Call to Enquire
          </a>
        )}

        <p className="text-center text-xs text-gray-400 pt-1">✅ Free cancellation · No booking fees</p>
      </div>
    </div>
  );
}