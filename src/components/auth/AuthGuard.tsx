"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/context/AuthContext";

interface AuthGuardProps {
  /** One or more roles allowed to access this page */
  allowedRoles: UserRole | UserRole[];
  /** What to render while auth state is loading */
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * AuthGuard — client-side route protection.
 *
 * Usage:
 *   <AuthGuard allowedRoles="vendor">
 *     <VendorDashboard />
 *   </AuthGuard>
 *
 *   <AuthGuard allowedRoles={["admin", "vendor"]}>
 *     <SharedPanel />
 *   </AuthGuard>
 *
 * Redirect logic:
 *   - Not logged in            → /login?redirect=<current path>
 *   - Wrong role               → role's default dashboard
 *   - Vendor + status pending  → /vendor/pending
 *   - Vendor + status rejected → /vendor/pending (shows rejected UI there)
 */
export function AuthGuard({
  allowedRoles,
  fallback,
  children,
}: AuthGuardProps) {
  const { user, profile, role, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  useEffect(() => {
    // Still resolving Firebase auth — wait
    if (loading) return;

    // Not authenticated
    if (!user || !profile) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // Vendor trying to access vendor routes but not yet approved
    if (
      role === "vendor" &&
      allowed.includes("vendor") &&
      profile.vendorStatus !== "approved" &&
      pathname !== "/vendor/pending"
    ) {
      router.replace("/vendor/pending");
      return;
    }

    // Wrong role entirely
    if (role && !allowed.includes(role)) {
      const roleRedirects: Record<UserRole, string> = {
        admin: "/admin/dashboard",
        vendor: "/vendor/dashboard",
        user: "/dashboard",
      };
      router.replace(roleRedirects[role] ?? "/");
    }
  }, [loading, user, profile, role, pathname, allowed, router]);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return fallback ?? <AuthGuardSkeleton />;
  }

  // ── Not authorised — render nothing while redirect fires ──────────────────
  if (!user || !profile || !role || !allowed.includes(role)) {
    return null;
  }

  // Vendor pending check (render nothing while redirecting)
  if (
    role === "vendor" &&
    allowed.includes("vendor") &&
    profile.vendorStatus !== "approved" &&
    pathname !== "/vendor/pending"
  ) {
    return null;
  }

  return <>{children}</>;
}

/* ── Default loading skeleton ─────────────────────────────────────────────── */
function AuthGuardSkeleton() {
  return (
    <div className="min-h-screen bg-kokan-cream/30 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Animated leaf logo */}
        <div className="relative">
          <span className="text-4xl animate-pulse">🌿</span>
        </div>
        {/* Spinner */}
        <div className="w-6 h-6 border-2 border-kokan-sand border-t-kokan-green rounded-full animate-spin" />
        <p className="text-sm text-kokan-earth/40 font-medium tracking-wide">
          Loading…
        </p>
      </div>
    </div>
  );
}