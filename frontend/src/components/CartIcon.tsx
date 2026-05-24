/* ═══════════════════════════════════════════════════
   CART ICON — LORE-style bag icon + item count badge
   ═══════════════════════════════════════════════════ */

import { useCart } from "../context/CartContext";

interface CartIconProps {
  onClick: () => void;
}

export default function CartIcon({ onClick }: CartIconProps) {
  const { totalItems } = useCart();

  return (
    <button
      onClick={onClick}
      aria-label={`Sepet — ${totalItems} ürün`}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "40px",
        height: "40px",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "var(--fg)",
      }}
    >
      {/* Minimal bag SVG */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>

      {/* Badge */}
      {totalItems > 0 && (
        <span
          style={{
            position: "absolute",
            top: "2px",
            right: "2px",
            minWidth: "16px",
            height: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-body)",
            fontSize: "10px",
            fontWeight: 400,
            letterSpacing: "0.02em",
            lineHeight: 1,
            color: "var(--bg)",
            backgroundColor: "var(--fg)",
            borderRadius: "999px",
            padding: "0 4px",
          }}
        >
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}
