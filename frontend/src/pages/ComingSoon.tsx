/* ═══════════════════════════════════════════════════
   COMING SOON PAGE — LORE-style placeholder
   ═══════════════════════════════════════════════════ */

function navigate(href: string) {
  window.history.pushState({}, "", href);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export default function ComingSoon() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-6)",
        padding: "var(--space-8)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-xs)",
          fontWeight: 300,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--fg-muted)",
        }}
      >
        Çok Yakında
      </span>

      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-4xl)",
          fontWeight: 400,
          fontStyle: "italic",
          color: "var(--fg)",
          lineHeight: 1.1,
          textAlign: "center",
        }}
      >
        Yakında Burada
      </h1>

      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-base)",
          fontWeight: 300,
          lineHeight: 1.7,
          color: "var(--fg-muted)",
          textAlign: "center",
          maxWidth: "420px",
          marginTop: "var(--space-2)",
        }}
      >
        Bu sayfa üzerinde çalışıyoruz. Çok yakında sizlerle buluşacak.
      </p>

      <button
        onClick={() => navigate("/")}
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-xs)",
          fontWeight: 400,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--fg-muted)",
          background: "none",
          border: "none",
          borderBottom: "1px solid var(--border)",
          paddingBottom: "2px",
          cursor: "pointer",
          marginTop: "var(--space-4)",
          transition: "color var(--duration-fast) var(--ease-soft)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-muted)")}
      >
        Ana Sayfaya Dön
      </button>
    </div>
  );
}
