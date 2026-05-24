/* ═══════════════════════════════════════════════════
   CART DRAWER — LORE-style slide-over cart
   ═══════════════════════════════════════════════════ */

import { useEffect } from "react";
import { useCart, type CartItem } from "../context/CartContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 999,
  backgroundColor: "rgba(0, 0, 0, 0.25)",
  transition: "opacity var(--duration-base) var(--ease-soft)",
};

const drawerBase: React.CSSProperties = {
  position: "fixed",
  top: 0,
  right: 0,
  bottom: 0,
  zIndex: 1000,
  width: "100%",
  maxWidth: "420px",
  backgroundColor: "var(--bg)",
  display: "flex",
  flexDirection: "column",
  transition: "transform var(--duration-base) var(--ease-expo)",
};

const pad: React.CSSProperties = { padding: "var(--space-6) var(--space-8)" };

// ─── Quantity Stepper ───────────────────────────────

function QuantityStepper({
  value,
  max,
  onChange,
}: {
  value: number;
  max: number;
  onChange: (v: number) => void;
}) {
  const btn: React.CSSProperties = {
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-sm)",
    fontWeight: 300,
    color: "var(--fg)",
    border: "1px solid var(--border)",
    background: "none",
    cursor: "pointer",
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
      <button
        type="button"
        style={{ ...btn, opacity: value <= 1 ? 0.3 : 1 }}
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
        aria-label="Adedi azalt"
      >
        &minus;
      </button>
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-sm)",
          fontWeight: 300,
          color: "var(--fg)",
          minWidth: "2ch",
          textAlign: "center",
        }}
      >
        {value}
      </span>
      <button
        type="button"
        style={{ ...btn, opacity: value >= max ? 0.3 : 1 }}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        aria-label="Adedi artır"
      >
        +
      </button>
    </div>
  );
}

// ─── Single Cart Item Row ───────────────────────────

function CartItemRow({
  item,
  onQuantityChange,
  onRemove,
}: {
  item: CartItem;
  onQuantityChange: (qty: number) => void;
  onRemove: () => void;
}) {
  const itemTotal = item.price * item.quantity;

  return (
    <div
      style={{
        display: "flex",
        gap: "var(--space-4)",
        padding: "var(--space-5) 0",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Thumbnail */}
      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          style={{
            width: "72px",
            height: "90px",
            objectFit: "cover",
            backgroundColor: "var(--bg-alt)",
            flexShrink: 0,
          }}
        />
      )}

      {/* Details */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h4
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-sm)",
                fontWeight: 400,
                fontStyle: "italic",
                color: "var(--fg)",
                lineHeight: 1.35,
              }}
            >
              {item.name}
            </h4>

            {item.variantLabel && (
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 300,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--fg-muted)",
                }}
              >
                {item.variantLabel}
              </span>
            )}
          </div>

          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              fontWeight: 400,
              color: "var(--fg)",
              whiteSpace: "nowrap",
            }}
          >
            ${itemTotal}
          </span>
        </div>

        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-xs)",
            fontWeight: 300,
            color: "var(--fg-muted)",
            marginTop: "var(--space-1)",
          }}
        >
          ${item.price} / adet
        </span>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "var(--space-3)",
          }}
        >
          <QuantityStepper
            value={item.quantity}
            max={item.maxStock}
            onChange={onQuantityChange}
          />
          <button
            onClick={onRemove}
            aria-label={`${item.name} ürününü kaldır`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              color: "var(--fg-muted)",
              background: "none",
              border: "1px solid transparent",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "all var(--duration-fast) var(--ease-soft)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--fg)";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--fg-muted)";
              e.currentTarget.style.borderColor = "transparent";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ────────────────────────────────────

function EmptyCart() {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-4)",
        padding: "var(--space-12)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-xl)",
          fontWeight: 400,
          fontStyle: "italic",
          color: "var(--fg-muted)",
        }}
      >
        Sepetiniz boş
      </span>
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-xs)",
          fontWeight: 300,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--fg-muted)",
        }}
      >
        Koleksiyonu keşfedin
      </span>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────

export default function CartDrawer({ isOpen, onClose, onCheckout }: CartDrawerProps) {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          ...overlayStyle,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-label="Alışveriş sepeti"
        style={{
          ...drawerBase,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Header */}
        <div
          style={{
            ...pad,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-3)" }}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-xl)",
                fontWeight: 400,
                fontStyle: "italic",
                color: "var(--fg)",
              }}
            >
              Sepet
            </span>
            {totalItems > 0 && (
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 300,
                  color: "var(--fg-muted)",
                  letterSpacing: "0.06em",
                }}
              >
                ({totalItems})
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            aria-label="Sepeti kapat"
            style={{
              fontSize: "var(--text-xl)",
              color: "var(--fg-muted)",
              lineHeight: 1,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            &times;
          </button>
        </div>

        {/* Items or empty state */}
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            <div
              style={{
                ...pad,
                flex: 1,
                overflowY: "auto",
              }}
            >
              {items.map((item) => (
                <CartItemRow
                  key={`${item.productId}-${item.variantId ?? "default"}`}
                  item={item}
                  onQuantityChange={(qty) =>
                    updateQuantity(item.productId, qty, item.variantId)
                  }
                  onRemove={() => removeFromCart(item.productId, item.variantId)}
                />
              ))}

              {/* Clear all */}
              {items.length > 1 && (
                <div style={{ textAlign: "center", marginTop: "var(--space-5)" }}>
                  <button
                    onClick={clearCart}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "var(--space-2)",
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-xs)",
                      fontWeight: 300,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--fg-muted)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      transition: "color var(--duration-fast) var(--ease-soft)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-muted)")}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                    Sepeti temizle
                  </button>
                </div>
              )}
            </div>

            {/* Footer — total + checkout */}
            <div
              style={{
                ...pad,
                borderTop: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-5)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-xs)",
                    fontWeight: 400,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--fg-muted)",
                  }}
                >
                  Toplam
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-2xl)",
                    fontWeight: 400,
                    color: "var(--fg)",
                  }}
                >
                  ${totalPrice}
                </span>
              </div>

              <button
                onClick={onCheckout}
                style={{
                  width: "100%",
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 400,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--bg)",
                  backgroundColor: "var(--fg)",
                  border: "none",
                  padding: "var(--space-4) var(--space-6)",
                  cursor: "pointer",
                  transition: "opacity var(--duration-fast) var(--ease-soft)",
                }}
              >
                Ödemeye Geç
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
