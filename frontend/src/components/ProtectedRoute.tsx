/* ═══════════════════════════════════════════════════
   PROTECTED ROUTE — Auth gate for restricted pages
   ═══════════════════════════════════════════════════
   Wraps routes that require authentication.
   Redirects to login if no session.
   Guest checkout bypasses this entirely.
   ═══════════════════════════════════════════════════ */

import { type ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function ProtectedRoute({
  children,
  fallback,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // Still hydrating from localStorage
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--bg)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
            color: "var(--fg-muted)",
            letterSpacing: "0.06em",
          }}
        >
          Yükleniyor...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    // If a fallback is provided (e.g. guest checkout), show it
    if (fallback) return <>{fallback}</>;

    // Otherwise redirect to login
    window.location.href = "/login";
    return null;
  }

  return <>{children}</>;
}
