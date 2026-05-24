/* ═══════════════════════════════════════════════════
   REGISTER PAGE — LORE-style signup + verification
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

// ─── Verification Sent ───────────────────────────────

function VerificationSent({ email, onResend }: { email: string; onResend: () => Promise<void> }) {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  async function handleResend() {
    setResending(true);
    try { await onResend(); setResent(true); } finally { setResending(false); }
  }

  return (
    <div style={pageStyle}>
      <div style={{ ...cardStyle, alignItems: "center", textAlign: "center" }}>
        <h1 style={headingStyle}>E-postanı Kontrol Et</h1>

        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-base)", fontWeight: 300, color: "var(--fg-secondary)", lineHeight: 1.7, maxWidth: "30ch" }}>
          Doğrulama bağlantısını şu adrese gönderdik:{" "}
          <strong style={{ color: "var(--fg)", fontWeight: 400 }}>{email}</strong>
        </p>

        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", fontWeight: 300, color: "var(--fg-muted)", lineHeight: 1.6 }}>
          Bağlantıya tıklayıp doğruladıktan sonra giriş yapabilirsin.
        </p>

        {resent ? (
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--fg-muted)" }}>
            E-posta tekrar gönderildi
          </p>
        ) : (
          <button onClick={handleResend} disabled={resending} style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", fontWeight: 400, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-muted)", background: "none", border: "none", borderBottom: "1px solid var(--border)", paddingBottom: "var(--space-1)", cursor: "pointer", opacity: resending ? 0.4 : 1 }}>
            {resending ? "Gönderiliyor..." : "Doğrulama e-postasını tekrar gönder"}
          </button>
        )}

        <a href="/login" style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg)", textDecoration: "underline", textUnderlineOffset: "3px", marginTop: "var(--space-4)" }}>
          Giriş Yap
        </a>
      </div>
    </div>
  );
}

// ─── Register Form ───────────────────────────────────

export default function Register() {
  const { register, resendVerification } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register({ name, email, password });
      setVerificationSent(true);
    } catch (err) {
      setError(err instanceof AuthError ? err.message : "Bir sorun oluştu. Lütfen tekrar deneyin.");
    } finally {
      setSubmitting(false);
    }
  }

  if (verificationSent) {
    return <VerificationSent email={email} onResend={() => resendVerification(email).then(() => {})} />;
  }

  return (
    <div style={pageStyle}>
      <form onSubmit={handleSubmit} style={cardStyle}>
        <h1 style={headingStyle}>Hesap Oluştur</h1>

        {error && (
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--fg-secondary)", textAlign: "center" }}>
            {error}
          </p>
        )}

        <div>
          <label style={labelStyle} htmlFor="reg-name">İsim</label>
          <input id="reg-name" type="text" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} onFocus={(e) => (e.currentTarget.style.borderColor = "var(--fg)")} onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")} />
        </div>

        <div>
          <label style={labelStyle} htmlFor="reg-email">E-posta</label>
          <input id="reg-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} onFocus={(e) => (e.currentTarget.style.borderColor = "var(--fg)")} onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")} />
        </div>

        <div>
          <label style={labelStyle} htmlFor="reg-password">Şifre</label>
          <input id="reg-password" type="password" required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} onFocus={(e) => (e.currentTarget.style.borderColor = "var(--fg)")} onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")} />
        </div>

        <button type="submit" disabled={submitting} style={{ ...buttonStyle, opacity: submitting ? 0.4 : 1 }}>
          {submitting ? "Hesap oluşturuluyor..." : "Hesap Oluştur"}
        </button>

        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", color: "var(--fg-muted)", textAlign: "center", letterSpacing: "0.04em" }}>
          Zaten hesabınız var mı?{" "}
          <a href="/login" style={{ color: "var(--fg)", textDecoration: "underline", textUnderlineOffset: "3px" }}>Giriş yap</a>
        </p>
      </form>
    </div>
  );
}
