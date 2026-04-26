"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthError } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, MapPin, Star, Waves } from "lucide-react";

export default function LoginPage() {
  const { signInWithEmail, loading: authLoading, profile } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // If already logged in (e.g. user navigates back to /login), send them away.
  // AuthContext's signInWithEmail handles the redirect on fresh login —
  // this only fires if they're ALREADY authenticated when they visit the page.
  if (!authLoading && profile) {
    if (profile.role === 'admin') return null   // middleware/AuthContext will redirect
    if (profile.role === 'vendor') return null
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // AuthContext.signInWithEmail handles role-based redirect internally
      await signInWithEmail(email, password);
    } catch (err) {
      const code = (err as AuthError).code;
      if (
        code === "auth/user-not-found" ||
        code === "auth/wrong-password" ||
        code === "auth/invalid-credential"
      ) {
        setError("Invalid email or password.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-kokan-green">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-kokan-green/80 via-kokan-green/60 to-kokan-earth/70" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="font-playfair text-2xl font-bold text-white">Visit Kokan</span>
          </Link>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full">
              <Waves className="w-4 h-4 text-white" />
              <span className="text-white/90 text-sm font-medium">The Konkan Coast Awaits</span>
            </div>
            <h2 className="font-playfair text-4xl xl:text-5xl font-bold text-white leading-tight">
              Pristine Beaches,<br />
              <span className="text-kokan-sand">Timeless Villages</span>
            </h2>
            <p className="text-white/70 text-base leading-relaxed max-w-sm">
              Discover hidden gems along 720km of India's most beautiful coastline.
            </p>
            <div className="flex gap-6 pt-2">
              {[
                { value: "120+", label: "Destinations" },
                { value: "4.8★", label: "Avg Rating" },
                { value: "5k+", label: "Travellers" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-white font-bold text-xl">{stat.value}</p>
                  <p className="text-white/50 text-xs mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5">
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-white/85 text-sm leading-relaxed italic">
              "Visit Kokan showed me places I never knew existed. The Malvan homestay was unforgettable."
            </p>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-7 h-7 rounded-full bg-kokan-sand flex items-center justify-center text-xs font-bold text-kokan-earth">P</div>
              <div>
                <p className="text-white text-xs font-medium">Priya Desai</p>
                <p className="text-white/40 text-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Mumbai
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-kokan-cream/30 px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-2xl">🌿</span>
              <span className="font-playfair text-xl font-bold text-kokan-earth">Visit Kokan</span>
            </Link>
          </div>

          <h1 className="font-playfair text-3xl font-bold text-kokan-earth mb-1">Welcome back</h1>
          <p className="text-kokan-earth/50 text-sm mb-8">Sign in to continue your journey</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-5 flex items-center gap-2">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-medium text-kokan-earth/70 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-kokan-sand rounded-xl px-4 py-3 text-sm text-kokan-earth bg-white focus:outline-none focus:ring-2 focus:ring-kokan-green/30 focus:border-kokan-green/50 transition-all placeholder:text-kokan-earth/30"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-kokan-earth/70">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-kokan-green hover:text-kokan-green/70 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-kokan-sand rounded-xl px-4 py-3 pr-11 text-sm text-kokan-earth bg-white focus:outline-none focus:ring-2 focus:ring-kokan-green/30 focus:border-kokan-green/50 transition-all placeholder:text-kokan-earth/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-kokan-earth/30 hover:text-kokan-earth/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-kokan-green text-white py-3 rounded-xl font-semibold text-sm hover:bg-kokan-green/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm shadow-kokan-green/30 mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-kokan-earth/50 mt-6">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-kokan-green font-medium hover:text-kokan-green/70 transition-colors"
            >
              Create one
            </Link>
          </p>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-kokan-sand/50" />
            <span className="text-xs text-kokan-earth/30">or</span>
            <div className="flex-1 h-px bg-kokan-sand/50" />
          </div>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full border border-kokan-sand rounded-xl py-3 text-sm text-kokan-earth/60 hover:bg-kokan-sand/10 transition-colors"
          >
            <Waves className="w-4 h-4" />
            Continue browsing as guest
          </Link>
        </div>
      </div>
    </div>
  );
}