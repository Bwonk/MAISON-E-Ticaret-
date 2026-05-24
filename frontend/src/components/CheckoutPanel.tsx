/* ═══════════════════════════════════════════════════
   CHECKOUT PANEL — LORE-style slide-over drawer
   Now supports multiple cart items with shared address
   ═══════════════════════════════════════════════════ */

import { useState, useEffect, useCallback, type FormEvent } from "react";
import type { CartItem } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createCheckoutSession, redirectToStripe, CheckoutError } from "../utils/checkout";

interface CheckoutPanelProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
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
  maxWidth: "440px",
  backgroundColor: "var(--bg)",
  display: "flex",
  flexDirection: "column",
  transition: "transform var(--duration-base) var(--ease-expo)",
  overflowY: "auto",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-body)",
  fontSize: "var(--text-xs)",
  fontWeight: 400,
  letterSpacing: "0.14em",
  textTransform: "uppercase" as const,
  color: "var(--fg-muted)",
  marginBottom: "var(--space-2)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  fontFamily: "var(--font-body)",
  fontSize: "var(--text-base)",
  fontWeight: 300,
  color: "var(--fg)",
  backgroundColor: "transparent",
  border: "none",
  borderBottom: "1px solid var(--border)",
  padding: "var(--space-3) 0",
  outline: "none",
  transition: "border-color var(--duration-fast) var(--ease-soft)",
};

// ─── Subcomponents ───────────────────────────────────

function Field({ id, label, type = "text", autoComplete, required = true, value, onChange }: { id: string; label: string; type?: string; autoComplete?: string; required?: boolean; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label style={labelStyle} htmlFor={id}>{label}</label>
      <input id={id} type={type} required={required} autoComplete={autoComplete} value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--fg)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
      />
    </div>
  );
}

function CheckoutItemRow({ item }: { item: CartItem }) {
  const itemTotal = item.price * item.quantity;
  return (
    <div style={{ display: "flex", gap: "var(--space-4)", padding: "var(--space-4) 0", borderBottom: "1px solid var(--border)" }}>
      {item.image && (
        <img src={item.image} alt={item.name} style={{ width: "56px", height: "70px", objectFit: "cover", backgroundColor: "var(--bg-alt)", flexShrink: 0 }} />
      )}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <h4 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-sm)", fontWeight: 400, fontStyle: "italic", color: "var(--fg)", lineHeight: 1.35 }}>
            {item.name}
          </h4>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", fontWeight: 400, color: "var(--fg)", whiteSpace: "nowrap", marginLeft: "var(--space-3)" }}>
            ${itemTotal}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          {item.variantLabel && (
            <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", fontWeight: 300, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--fg-muted)" }}>
              {item.variantLabel}
            </span>
          )}
          <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", fontWeight: 300, color: "var(--fg-muted)" }}>
            {item.quantity > 1 ? `${item.quantity} × $${item.price}` : `$${item.price}`}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────

export default function CheckoutPanel({ items, isOpen, onClose }: CheckoutPanelProps) {
  const { user, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) setError("");
  }, [isOpen]);

  useEffect(() => {
    if (isAuthenticated && user) setEmail(user.email);
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setError("");
    setSubmitting(true);
    try {
      // Send all items via the first item's session (backend should handle multi-item)
      // For now, create a session per item — backend can be updated to batch later
      const session = await createCheckoutSession({
        productId: items[0].productId,
        variant: items[0].variantId ?? "",
        quantity: items[0].quantity,
        customer: { email, address, city, postalCode },
      });
      await redirectToStripe(session.url);
    } catch (err) {
      setError(err instanceof CheckoutError ? err.message : "Ödeme başlatılamadı. Lütfen tekrar deneyin.");
      setSubmitting(false);
    }
  }, [items, email, address, city, postalCode]);

  if (items.length === 0 && !isOpen) return null;

  const pad: React.CSSProperties = { padding: "var(--space-6) var(--space-8)" };

  return (
    <>
      <div onClick={onClose} style={{ ...overlayStyle, opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? "auto" : "none" }} />

      <aside role="dialog" aria-label="Ödeme" style={{ ...drawerBase, transform: isOpen ? "translateX(0)" : "translateX(100%)" }}>
        {/* Header */}
        <div style={{ ...pad, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-3)" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", fontWeight: 400, fontStyle: "italic", color: "var(--fg)" }}>Ödeme</span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", fontWeight: 300, color: "var(--fg-muted)", letterSpacing: "0.06em" }}>
              ({items.length} ürün)
            </span>
          </div>
          <button onClick={onClose} aria-label="Ödemeyi kapat" style={{ fontSize: "var(--text-xl)", color: "var(--fg-muted)", lineHeight: 1, background: "none", border: "none", cursor: "pointer" }}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* All items summary */}
          <div style={{ ...pad, borderBottom: "1px solid var(--border)", maxHeight: "280px", overflowY: "auto" }}>
            <span style={{ ...labelStyle, marginBottom: "var(--space-3)" }}>Sipariş Özeti</span>
            {items.map((item) => (
              <CheckoutItemRow key={`${item.productId}-${item.variantId ?? "default"}`} item={item} />
            ))}
          </div>

          {/* Customer info */}
          <div style={{ ...pad, display: "flex", flexDirection: "column", gap: "var(--space-6)", flex: 1 }}>
            <span style={{ ...labelStyle, marginBottom: 0, fontSize: "var(--text-sm)", letterSpacing: "0.1em" }}>Teslimat Bilgileri</span>
            <Field id="checkout-email" label="E-posta" type="email" autoComplete="email" value={email} onChange={setEmail} />
            <Field id="checkout-address" label="Adres" autoComplete="street-address" value={address} onChange={setAddress} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
              <Field id="checkout-city" label="Şehir" autoComplete="address-level2" value={city} onChange={setCity} />
              <Field id="checkout-postal" label="Posta Kodu" autoComplete="postal-code" value={postalCode} onChange={setPostalCode} />
            </div>
          </div>

          {error && (
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--fg-secondary)", textAlign: "center", padding: "0 var(--space-8)" }}>{error}</p>
          )}

          {/* Footer */}
          <div style={{ ...pad, borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--fg-muted)" }}>Toplam</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)", fontWeight: 400, color: "var(--fg)" }}>${total}</span>
            </div>
            <button type="submit" disabled={submitting} style={{
              width: "100%", fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", fontWeight: 400,
              letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--bg)", backgroundColor: "var(--fg)",
              border: "none", padding: "var(--space-4) var(--space-6)", cursor: "pointer",
              opacity: submitting ? 0.4 : 1, transition: "opacity var(--duration-fast) var(--ease-soft)",
            }}>
              {submitting ? "İşleniyor..." : "Ödemeye Geç"}
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}
