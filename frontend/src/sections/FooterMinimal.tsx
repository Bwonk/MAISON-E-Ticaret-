import { useEffect, useState } from "react";
import type { FooterMinimalProps } from "../types/sections";
import { getFooterSettings } from "../utils/data";

export default function FooterMinimal({
  logo,
  links,
  copyright,
}: FooterMinimalProps) {
  const [footerData, setFooterData] = useState<any>(null);

  useEffect(() => {
    getFooterSettings().then(setFooterData);
  }, []);

  const resolvedLogo = footerData?.logo ?? logo;
  const resolvedCopyright = `© 2026 ${resolvedLogo}. Tüm hakları saklıdır.`;

  const midpoint = Math.ceil(links.length / 2);
  const col1 = links.slice(0, midpoint);
  const col2 = links.slice(midpoint);

  return (
    <footer>
      <div
        style={{
          backgroundColor: "var(--bg)",
          padding: "var(--space-20) var(--space-8) var(--space-12)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "var(--max-width)",
            marginInline: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--space-10)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-xs)",
              fontWeight: 300,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--fg-muted)",
            }}
          >
            @{resolvedLogo.toLowerCase()}
          </span>

          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-4xl)",
              fontWeight: 400,
              fontStyle: "italic",
              color: "var(--fg)",
              lineHeight: 1,
            }}
          >
            {resolvedLogo}
          </span>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              maxWidth: "420px",
              borderBottom: "1px solid var(--border-strong)",
              paddingBottom: "var(--space-3)",
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
                flex: 1,
              }}
            >
              Bültenimize abone olun
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-base)",
                color: "var(--fg)",
              }}
            >
              &rarr;
            </span>
          </div>

          <div
            style={{
              display: "flex",
              gap: "var(--space-16)",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "var(--space-4)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              {col1.map((link) => (
                
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    if (link.href.startsWith("/")) {
                      e.preventDefault();
                      window.history.pushState({}, "", link.href);
                      window.dispatchEvent(new PopStateEvent("popstate"));
                    }
                  }}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-xs)",
                    fontWeight: 300,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--fg-secondary)",
                    textDecoration: "none",
                    transition: "opacity var(--duration-fast) var(--ease-soft)",
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              {col2.map((link) => (

                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    if (link.href.startsWith("/")) {
                      e.preventDefault();
                      window.history.pushState({}, "", link.href);
                      window.dispatchEvent(new PopStateEvent("popstate"));
                    }
                  }}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-xs)",
                    fontWeight: 300,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--fg-secondary)",
                    textDecoration: "none",
                    transition: "opacity var(--duration-fast) var(--ease-soft)",
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {copyright && (
        <div
          style={{
            backgroundColor: "var(--fg)",
            padding: "var(--space-4) var(--space-8)",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "var(--max-width)",
              marginInline: "auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-xs)",
                fontWeight: 300,
                letterSpacing: "0.04em",
                color: "var(--bg)",
                opacity: 0.5,
              }}
            >
              {resolvedCopyright}
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-xs)",
                fontWeight: 300,
                letterSpacing: "0.04em",
                color: "var(--bg)",
                opacity: 0.5,
              }}
            >
              Koşullar &amp; Gizlilik
            </span>
          </div>
        </div>
      )}
    </footer>
  );
}
