/* ═══════════════════════════════════════════════════
   ABOUT PAGE — LORE-style editorial about page
   ═══════════════════════════════════════════════════
   Content fetched from Strapi (/api/about-page).
   Falls back to static defaults when offline / no CMS.
   ═══════════════════════════════════════════════════ */

import { useState, useEffect } from "react";
import { getAboutPage } from "../utils/data";

interface AboutData {
  title: string;
  subtitle: string;
  story: string;
  values: { heading: string; text: string }[];
  image: string | null;
}

const DEFAULTS: AboutData = {
  title: "Hikayemiz",
  subtitle: "Bilinçli yaşam için rafine parçalar",
  story:
    "Her parçamız, kalıcılık ve zarafet ilkesiyle tasarlanır. Hızlı modanın ötesinde, zamansız estetiği ve sürdürülebilir üretimi bir araya getiriyoruz. Amacımız, her detayda kaliteyi hissettiren ve yıllarca keyifle kullanılacak ürünler yaratmak.",
  values: [
    {
      heading: "Kalite",
      text: "En iyi malzemeler, en iyi işçilikle buluşur. Her dikiş, her kesim bilinçli bir tercihdir.",
    },
    {
      heading: "Sürdürülebilirlik",
      text: "Çevreye duyarlı üretim süreçleri, sorumlu tedarik zincirleri ve uzun ömürlü tasarımlar.",
    },
    {
      heading: "Zamansızlık",
      text: "Trendlerin ötesinde, yıllarca gardırobunuzun vazgeçilmezi olacak parçalar yaratıyoruz.",
    },
  ],
  image: null,
};

function navigate(href: string) {
  window.history.pushState({}, "", href);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export default function About() {
  const [data, setData] = useState<AboutData>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAboutPage()
      .then((d) => {
        if (d) setData({ ...DEFAULTS, ...d });
      })
      .finally(() => setLoading(false));
  }, []);

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
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
          paddingBottom: "var(--space-20)",
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

      {/* Image + Story */}
      <section
        style={{
          maxWidth: "var(--max-width)",
          marginInline: "auto",
          paddingInline: "var(--space-8)",
          paddingBottom: "var(--space-20)",
        }}
      >
        {data.image && (
          <div
            style={{
              width: "100%",
              aspectRatio: "21/9",
              overflow: "hidden",
              marginBottom: "var(--space-16)",
            }}
          >
            <img
              src={data.image}
              alt="Hakkımızda"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}

        <div
          style={{
            maxWidth: "720px",
            marginInline: "auto",
            opacity: loading ? 0.4 : 1,
            transition: "opacity var(--duration-slow) var(--ease-soft)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-lg)",
              fontWeight: 300,
              lineHeight: 1.8,
              color: "var(--fg)",
              textAlign: "center",
            }}
          >
            {data.story}
          </p>
        </div>
      </section>

      {/* Divider */}
      <div
        style={{
          maxWidth: "120px",
          height: "1px",
          backgroundColor: "var(--border-strong)",
          marginInline: "auto",
        }}
      />

      {/* Values */}
      <section
        style={{
          maxWidth: "var(--max-width)",
          marginInline: "auto",
          paddingInline: "var(--space-8)",
          paddingTop: "var(--space-20)",
          paddingBottom: "var(--space-32)",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-2xl)",
            fontWeight: 400,
            fontStyle: "italic",
            color: "var(--fg)",
            textAlign: "center",
            marginBottom: "var(--space-16)",
          }}
        >
          Değerlerimiz
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "var(--space-12)",
            maxWidth: "960px",
            marginInline: "auto",
          }}
        >
          {data.values.map((v, i) => (
            <div
              key={i}
              style={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-4)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 400,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--fg)",
                }}
              >
                {v.heading}
              </span>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 300,
                  lineHeight: 1.7,
                  color: "var(--fg-muted)",
                }}
              >
                {v.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
