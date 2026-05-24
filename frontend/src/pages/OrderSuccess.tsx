/* ═══════════════════════════════════════════════════
   ORDER SUCCESS — LORE-style confirmation
   ═══════════════════════════════════════════════════ */

export default function OrderSuccess() {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get("session_id");

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg)", padding: "var(--space-8)" }}>
      <div style={{ maxWidth: "420px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-6)" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-3xl)", fontWeight: 400, fontStyle: "italic", color: "var(--fg)" }}>
          Teşekkürler
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-base)", fontWeight: 300, color: "var(--fg-secondary)", lineHeight: 1.7, maxWidth: "34ch" }}>
          Siparişiniz alındı. Onay e-postası kısa süre içinde gönderilecek.
        </p>
        {sessionId && (
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", fontWeight: 300, color: "var(--fg-muted)", letterSpacing: "0.04em" }}>
            Ref: {sessionId.slice(0, 20)}...
          </p>
        )}
        <a href="/" style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--fg)", borderBottom: "1px solid var(--fg)", paddingBottom: "var(--space-1)", textDecoration: "none", marginTop: "var(--space-6)" }}>
          Keşfetmeye Devam Et
        </a>
      </div>
    </div>
  );
}
