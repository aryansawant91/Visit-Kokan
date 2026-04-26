"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Users, Calendar, IndianRupee } from "lucide-react";

interface Props {
  trekName: string;
  price?: number;
  groupSize?: string;
  duration: string;
}

export default function TrekBookingWidget({ trekName, price, groupSize, duration }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const [persons, setPersons] = useState(1);
  const [date, setDate] = useState("");

  const total = (price ?? 0) * persons;

  const handleBook = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    // Booking flow — to be built in bookings feature
    alert(`Booking coming soon! Trek: ${trekName}, Persons: ${persons}, Date: ${date}`);
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 sticky top-24">
      {/* Price */}
      {price ? (
        <div className="mb-5">
          <p className="text-gray-400 text-sm">Starting from</p>
          <div className="flex items-end gap-1">
            <span className="text-3xl font-bold text-kokan-earth">
              ₹{price.toLocaleString("en-IN")}
            </span>
            <span className="text-gray-400 text-sm mb-1">/ person</span>
          </div>
        </div>
      ) : (
        <div className="mb-5">
          <span className="text-lg font-semibold text-kokan-earth">Free / Community Trek</span>
        </div>
      )}

      <div className="space-y-3">
        {/* Date picker */}
        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1.5">
            <Calendar size={14} /> Select Date
          </label>
          <input
            type="date"
            min={minDate}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
          />
        </div>

        {/* Persons */}
        {price && (
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1.5">
              <Users size={14} /> Number of Persons
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPersons((p) => Math.max(1, p - 1))}
                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-lg font-medium hover:bg-gray-50"
              >
                −
              </button>
              <span className="text-lg font-semibold text-kokan-earth w-8 text-center">
                {persons}
              </span>
              <button
                onClick={() => setPersons((p) => p + 1)}
                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-lg font-medium hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Total */}
        {price && (
          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <span className="text-sm font-medium text-gray-600">Total</span>
            <span className="text-lg font-bold text-kokan-earth flex items-center gap-1">
              <IndianRupee size={16} />
              {total.toLocaleString("en-IN")}
            </span>
          </div>
        )}

        {/* Book button */}
        <button
          onClick={handleBook}
          className="w-full bg-kokan-green text-white py-3.5 rounded-xl font-semibold hover:bg-kokan-green/90 transition-colors"
        >
          {user ? "Book This Trek" : "Login to Book"}
        </button>

        {/* Info pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          <span className="text-xs bg-gray-50 text-gray-500 px-3 py-1 rounded-full border border-gray-100">
            ⏱ {duration}
          </span>
          {groupSize && (
            <span className="text-xs bg-gray-50 text-gray-500 px-3 py-1 rounded-full border border-gray-100">
              👥 {groupSize}
            </span>
          )}
          <span className="text-xs bg-gray-50 text-gray-500 px-3 py-1 rounded-full border border-gray-100">
            ✅ Free cancellation
          </span>
        </div>
      </div>
    </div>
  );
}