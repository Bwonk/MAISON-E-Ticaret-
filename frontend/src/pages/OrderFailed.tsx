/* ═══════════════════════════════════════════════════
   ORDER FAILED — LORE-style failure page
   ═══════════════════════════════════════════════════ */

export default function OrderFailed() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg)", padding: "var(--space-8)" }}>
      <div style={{ maxWidth: "420px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-6)" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-3xl)", fontWeight: 400, fontStyle: "italic", color: "var(--fg)" }}>
          Ödeme Tamamlanamadı
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-base)", fontWeight: 300, color: "var(--fg-secondary)", lineHeight: 1.7, maxWidth: "34ch" }}>
          Ödemeniz gerçekleştirilemedi. Hesabınızdan herhangi bir tutar çekilmedi. Lütfen tekrar deneyin veya destek ile iletişime geçin.
        </p>
        <a href="/" style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--fg)", borderBottom: "1px solid var(--fg)", paddingBottom: "var(--space-1)", textDecoration: "none", marginTop: "var(--space-6)" }}>
          Alışverişe Dön
        </a>
      </div>
    </div>
  );
}
