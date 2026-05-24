import { useEffect, useState } from "react";
import type { StoryGalleryProps } from "../types/sections";
import { useGalleryRevealGsap } from "../hooks/useGsap";
import { getGallery } from "../utils/data";

export default function StoryGallery({ heading, images }: StoryGalleryProps) {
  const sectionRef = useGalleryRevealGsap();
  const [galleryData, setGalleryData] = useState<any>(null);

  useEffect(() => {
    getGallery().then(setGalleryData);
  }, []);

  const resolvedImages = galleryData?.images
    ? galleryData.images.map((url: string) => ({ src: url, alt: "" }))
    : images;

  return (
    <section
      ref={sectionRef}
      style={{
        backgroundColor: "var(--bg)",
        padding: "var(--space-24) 0",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "var(--max-width)",
          marginInline: "auto",
          paddingInline: "var(--space-8)",
        }}
      >
        {heading && (
          <div style={{ textAlign: "center", marginBottom: "var(--space-12)" }}>
            <span
              style={{
                display: "block",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-xs)",
                fontWeight: 400,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--fg-muted)",
                marginBottom: "var(--space-3)",
              }}
            >
              Sizden
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-2xl)",
                fontWeight: 400,
                fontStyle: "italic",
                color: "var(--fg)",
                letterSpacing: "0.01em",
              }}
            >
              {heading}
            </h2>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "var(--grid-gap)",
          }}
        >
          {resolvedImages.map((img: { src: string; alt: string }, i: number) => (
            <div
              key={i}
              data-gallery-item
              style={{
                overflow: "hidden",
                aspectRatio: "1/1",
              }}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform var(--duration-slow) var(--ease-expo)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.03)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}