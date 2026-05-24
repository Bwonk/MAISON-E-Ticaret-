import { useEffect, useState } from "react";
import type { HeroMediaProps } from "../types/sections";
import { useHeroMediaGsap } from "../hooks/useGsap";
import { getHeroMedia } from "../utils/data";

export default function HeroMedia({ brandName, tagline, media, cta }: HeroMediaProps) {
  const sectionRef = useHeroMediaGsap();
  const [heroData, setHeroData] = useState<any>(null);

  useEffect(() => {
    getHeroMedia().then(setHeroData);
  }, []);

  const resolvedBrandName = heroData?.title ?? brandName;
  const resolvedTagline = heroData?.subtitle ?? tagline;
  const resolvedSrc = heroData?.image ?? media.src;

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#0a0a0a",
      }}
    >
      {media.type === "video" ? (
        <video
          src={resolvedSrc}
          poster={media.poster}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <img
          src={resolvedSrc}
          alt={media.alt}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.25) 100%)",
        }}
      />

      <h1
        data-hero-animate
        style={{
          position: "absolute",
          top: "var(--space-8)",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.5rem, 3vw, 2rem)",
          fontWeight: 400,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "#ffffff",
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        {resolvedBrandName}
      </h1>

      <div
        style={{
          position: "absolute",
          bottom: "var(--space-12)",
          left: "var(--space-8)",
          zIndex: 2,
          maxWidth: "36ch",
        }}
      >
        {resolvedTagline && (
          <p
            data-hero-animate
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-lg)",
              fontWeight: 400,
              fontStyle: "italic",
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1.5,
              letterSpacing: "0.01em",
            }}
          >
            {resolvedTagline}
          </p>
        )}

        {cta && (
        <a
            href={cta.href}
            data-hero-animate
            style={{
              display: "inline-block",
              marginTop: "var(--space-5)",
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-xs)",
              fontWeight: 400,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#ffffff",
              textDecoration: "none",
              transition: "opacity var(--duration-fast) var(--ease-soft)",
            }}
          >
            {cta.label} &rarr;
          </a>
        )}
      </div>
    </section>
  );
}