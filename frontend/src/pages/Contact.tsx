/* ═══════════════════════════════════════════════════
   CONTACT PAGE — LORE-style editorial contact page
   ═══════════════════════════════════════════════════
   Content fetched from Strapi (/api/contact-page).
   Falls back to static defaults when offline / no CMS.
   ═══════════════════════════════════════════════════ */

import { useState, useEffect, type FormEvent } from "react";
import { getContactPage } from "../utils/data";

interface ContactData {
  title: string;
  subtitle: string;
  description: string;
  email: string;
  phone: string;
  address: string;
}

const DEFAULTS: ContactData = {
  title: "İletişim",
  subtitle: "Size nasıl yardımcı olabiliriz?",
  description:
    "Sorularınız, önerileriniz veya işbirliği talepleriniz için bizimle iletişime geçebilirsiniz. En kısa sürede size dönüş yapacağız.",
  email: "info@maison.com",
  phone: "+90 212 000 00 00",
  address: "Nişantaşı, İstanbul",
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

function navigate(href: string) {
  window.history.pushState({}, "", href);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export default function Contact() {
  const [data, setData] = useState<ContactData>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    getContactPage()
      .then((d) => {
        if (d) setData({ ...DEFAULTS, ...d });
      })
      .finally(() => setLoading(false));
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)" }}>
      {/* Back nav */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "var(--space-5) var(--space-8)",
        }}
      >
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
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            transition: "color var(--duration-fast) var(--ease-soft)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-muted)")}
        >
          &larr; Ana Sayfa
        </button>
      </nav>

      {/* Hero */}
      <header
        style={{
          paddingTop: "var(--space-32)",
          paddingBottom: "var(--space-12)",
          paddingInline: "var(--space-8)",
          textAlign: "center",
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
          {data.subtitle}
        </span>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-4xl)",
            fontWeight: 400,
            fontStyle: "italic",
            color: "var(--fg)",
            lineHeight: 1.1,
            marginTop: "var(--space-4)",
          }}
        >
          {data.title}
        </h1>
      </header>

      {/* Content */}
      <section
        style={{
          maxWidth: "960px",
          marginInline: "auto",
          paddingInline: "var(--space-8)",
          paddingBottom: "var(--space-32)",
          opacity: loading ? 0.4 : 1,
          transition: "opacity var(--duration-slow) var(--ease-soft)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-base)",
            fontWeight: 300,
            lineHeight: 1.7,
            color: "var(--fg-muted)",
            textAlign: "center",
            maxWidth: "600px",
            marginInline: "auto",
            marginBottom: "var(--space-16)",
          }}
        >
          {data.description}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "var(--space-16)",
            alignItems: "start",
          }}
        >
          {/* Contact info */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-8)",
            }}
          >
            <div>
              <span style={labelStyle}>E-posta</span>
              <a
                href={`mailto:${data.email}`}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-base)",
                  fontWeight: 300,
                  color: "var(--fg)",
                  textDecoration: "none",
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: "2px",
                  transition: "border-color var(--duration-fast) var(--ease-soft)",
                }}
              >
                {data.email}
              </a>
            </div>

            <div>
              <span style={labelStyle}>Telefon</span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-base)",
                  fontWeight: 300,
                  color: "var(--fg)",
                }}
              >
                {data.phone}
              </span>
            </div>

            <div>
              <span style={labelStyle}>Adres</span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-base)",
                  fontWeight: 300,
                  color: "var(--fg)",
                }}
              >
                {data.address}
              </span>
            </div>
          </div>

          {/* Contact form */}
          {sent ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "var(--space-4)",
                padding: "var(--space-12)",
                border: "1px solid var(--border)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-xl)",
                  fontWeight: 400,
                  fontStyle: "italic",
                  color: "var(--fg)",
                }}
              >
                Teşekkürler
              </span>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 300,
                  color: "var(--fg-muted)",
                  textAlign: "center",
                }}
              >
                Mesajınız alındı. En kısa sürede size dönüş yapacağız.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-6)",
              }}
            >
              <div>
                <label style={labelStyle} htmlFor="contact-name">
                  İsim
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--fg)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                />
              </div>

              <div>
                <label style={labelStyle} htmlFor="contact-email">
                  E-posta
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--fg)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                />
              </div>

              <div>
                <label style={labelStyle} htmlFor="contact-message">
                  Mesaj
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    minHeight: "100px",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--fg)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                />
              </div>

              <button
                type="submit"
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
                  marginTop: "var(--space-2)",
                }}
              >
                Gönder
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
