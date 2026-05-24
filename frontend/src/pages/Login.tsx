/* ═══════════════════════════════════════════════════
   LOGIN PAGE — LORE-style minimal auth
   ═══════════════════════════════════════════════════ */

import { useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { AuthError } from "../utils/auth";

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "var(--bg)",
  padding: "var(--space-8)",
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "360px",
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-8)",
};

const headingStyle: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "var(--text-2xl)",
  fontWeight: 400,
  fontStyle: "italic",
  color: "var(--fg)",
  textAlign: "center",
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

const buttonStyle: React.CSSProperties = {
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
};

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login({ email, password });
    } catch (err) {
      setError(err instanceof AuthError ? err.message : "Bir sorun oluştu. Lütfen tekrar deneyin.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={pageStyle}>
      <form onSubmit={handleSubmit} style={cardStyle}>
        <h1 style={headingStyle}>Giriş Yap</h1>

        {error && (
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--fg-secondary)", textAlign: "center" }}>
            {error}
          </p>
        )}

        <div>
          <label style={labelStyle} htmlFor="login-email">E-posta</label>
          <input
            id="login-email" type="email" required autoComplete="email"
            value={email} onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--fg)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          />
        </div>

        <div>
          <label style={labelStyle} htmlFor="login-password">Şifre</label>
          <input
            id="login-password" type="password" required autoComplete="current-password"
            value={password} onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--fg)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          />
        </div>

        <button type="submit" disabled={submitting} style={{ ...buttonStyle, opacity: submitting ? 0.4 : 1 }}>
          {submitting ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>

        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", color: "var(--fg-muted)", textAlign: "center", letterSpacing: "0.04em" }}>
          Hesabınız yok mu?{" "}
          <a href="/register" style={{ color: "var(--fg)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
            Hesap oluştur
          </a>
        </p>
      </form>
    </div>
  );
}
