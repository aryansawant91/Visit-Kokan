"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { MapPin, Calendar, Users, Wallet, Loader2, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const INTERESTS = [
  { label: "Beaches", emoji: "🏖️" },
  { label: "Trekking", emoji: "🧗" },
  { label: "Food", emoji: "🍛" },
  { label: "History", emoji: "🏰" },
  { label: "Nature", emoji: "🌿" },
  { label: "Water Sports", emoji: "🤿" },
  { label: "Photography", emoji: "📸" },
  { label: "Temples", emoji: "🛕" },
];

interface TripPlan {
  summary: string;
  days: { day: number; title: string; activities: string[] }[];
  tips: string[];
  estimatedBudget: string;
}

export default function TripPlannerPage() {
  const { profile } = useAuth();
  const [form, setForm] = useState({
    startDate: "",
    days: "3",
    persons: "2",
    budget: "medium",
    interests: [] as string[],
    region: "all",
  });
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (interest: string) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const generatePlan = async () => {
    setLoading(true);
    // Rule-based trip planner (no paid API)
    await new Promise((r) => setTimeout(r, 1500));

    const days = parseInt(form.days);
    const hasBeach = form.interests.includes("Beaches") || form.interests.length === 0;
    const hasTrek = form.interests.includes("Trekking");
    const hasFood = form.interests.includes("Food");

    const planDays = Array.from({ length: days }, (_, i) => {
      const day = i + 1;
      const activities = [];
      if (day === 1) {
        activities.push("Arrive and check into your homestay");
        activities.push(hasBeach ? "Evening walk at the nearest beach" : "Explore the local market");
        activities.push("Dinner at a local Malvani restaurant");
      } else if (day === days) {
        activities.push(hasFood ? "Morning visit to local spice market" : "Last morning beach walk");
        activities.push("Buy Kokan souvenirs — cashews, kokum, mangoes");
        activities.push("Depart");
      } else {
        if (hasTrek && day === 2) {
          activities.push("Morning trek to nearby fort or hill");
          activities.push("Pack lunch and explore the trail");
          activities.push("Evening rest and local dinner");
        } else {
          activities.push("Visit a nearby beach or destination");
          activities.push("Water sports or boat ride (if available)");
          activities.push("Sunset at the coast");
        }
      }
      return {
        day,
        title: day === 1 ? "Arrival & Settle In" : day === days ? "Departure Day" : `Day ${day} — Explore`,
        activities,
      };
    });

    const budgetMap = {
      budget: "₹2,000–₹3,500/day",
      medium: "₹3,500–₹6,000/day",
      luxury: "₹6,000–₹12,000/day",
    };

    setPlan({
      summary: `A perfect ${days}-day Kokan trip for ${form.persons} person(s). ${
        form.interests.length > 0
          ? `Focused on ${form.interests.join(", ")}.`
          : "A well-rounded coastal experience."
      }`,
      days: planDays,
      tips: [
        "Book homestays in advance during peak season (Nov–Jan)",
        "Carry cash — many local spots don't accept cards",
        "Best time to visit beaches is early morning",
        form.interests.includes("Trekking") ? "Wear proper footwear for treks" : "Try the local Solkadhi at every meal",
        "Rent a local vehicle for flexibility",
      ],
      estimatedBudget: budgetMap[form.budget as keyof typeof budgetMap],
    });
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-2xl font-bold text-kokan-earth flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-kokan-sand" /> Trip Planner
        </h1>
        <p className="text-kokan-earth/50 text-sm mt-1">
          Tell us your preferences and we'll build your perfect Kokan itinerary
        </p>
      </div>

      {!plan ? (
        <div className="bg-white rounded-2xl p-6 border border-kokan-sand/30 space-y-6">
          {/* Dates + Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-kokan-earth/60 mb-1.5">
                <Calendar className="w-3.5 h-3.5 inline mr-1" /> Start Date
              </label>
              <input
                type="date"
                value={form.startDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-kokan-earth/60 mb-1.5">
                Duration (days)
              </label>
              <select
                value={form.days}
                onChange={(e) => setForm({ ...form, days: e.target.value })}
                className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
              >
                {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                  <option key={d} value={d}>{d} {d === 1 ? "day" : "days"}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Persons + Budget */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-kokan-earth/60 mb-1.5">
                <Users className="w-3.5 h-3.5 inline mr-1" /> Persons
              </label>
              <select
                value={form.persons}
                onChange={(e) => setForm({ ...form, persons: e.target.value })}
                className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
              >
                {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? "person" : "persons"}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-kokan-earth/60 mb-1.5">
                <Wallet className="w-3.5 h-3.5 inline mr-1" /> Budget
              </label>
              <select
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
              >
                <option value="budget">Budget (₹2k–₹3.5k/day)</option>
                <option value="medium">Mid-range (₹3.5k–₹6k/day)</option>
                <option value="luxury">Luxury (₹6k+/day)</option>
              </select>
            </div>
          </div>

          {/* Region */}
          <div>
            <label className="block text-xs font-medium text-kokan-earth/60 mb-1.5">
              <MapPin className="w-3.5 h-3.5 inline mr-1" /> Preferred Region
            </label>
            <select
              value={form.region}
              onChange={(e) => setForm({ ...form, region: e.target.value })}
              className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
            >
              <option value="all">All of Konkan</option>
              <option value="ratnagiri">Ratnagiri</option>
              <option value="sindhudurg">Sindhudurg</option>
              <option value="raigad">Raigad</option>
            </select>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-xs font-medium text-kokan-earth/60 mb-3">
              Interests (select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((interest) => (
                <button
                  key={interest.label}
                  onClick={() => toggleInterest(interest.label)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    form.interests.includes(interest.label)
                      ? "bg-kokan-green text-white"
                      : "bg-kokan-sand/20 text-kokan-earth/70 hover:bg-kokan-sand/30"
                  }`}
                >
                  {interest.emoji} {interest.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generatePlan}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-kokan-green text-white rounded-2xl font-bold text-sm hover:bg-kokan-green/90 transition-colors disabled:opacity-60"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Building your itinerary...</>
            ) : (
              <><Sparkles className="w-5 h-5" /> Generate My Trip Plan</>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Plan header */}
          <div className="bg-kokan-green rounded-2xl p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-kokan-sand" />
              <span className="text-sm font-medium text-white/70">Your Kokan Itinerary</span>
            </div>
            <p className="font-playfair text-xl font-bold mb-1">{form.days}-Day Kokan Adventure</p>
            <p className="text-white/70 text-sm">{plan.summary}</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
                💰 {plan.estimatedBudget} per person
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
                👥 {form.persons} person(s)
              </span>
            </div>
          </div>

          {/* Day-by-day */}
          <div className="space-y-3">
            {plan.days.map((day) => (
              <div key={day.day} className="bg-white rounded-2xl p-5 border border-kokan-sand/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-kokan-green/10 flex items-center justify-center text-kokan-green font-bold text-sm">
                    {day.day}
                  </div>
                  <h3 className="font-semibold text-kokan-earth">{day.title}</h3>
                </div>
                <ul className="space-y-2">
                  {day.activities.map((activity, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-kokan-earth/70">
                      <span className="text-kokan-green mt-0.5">•</span>
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className="bg-kokan-sand/10 rounded-2xl p-5 border border-kokan-sand/30">
            <h3 className="font-semibold text-kokan-earth mb-3">💡 Travel Tips</h3>
            <ul className="space-y-2">
              {plan.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-kokan-earth/70">
                  <span className="text-kokan-sand mt-0.5">✓</span> {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPlan(null)}
              className="py-3 border border-kokan-sand rounded-2xl text-sm text-kokan-earth/60 hover:bg-kokan-sand/10 transition-colors"
            >
              Plan Again
            </button>
            <Link
              href="/destinations"
              className="flex items-center justify-center gap-2 py-3 bg-kokan-green text-white rounded-2xl text-sm font-semibold hover:bg-kokan-green/90 transition-colors"
            >
              Explore Destinations <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}