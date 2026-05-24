import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import type { AmbientMediaProps } from "../types/sections";
import { useAmbientParallaxGsap } from "../hooks/useGsap";
import { getCampaign } from "../utils/data";

type OverlayPosition = "center" | "bottom-left" | "bottom-right";

const overlayPositionStyles: Record<OverlayPosition, CSSProperties> = {
  center: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
  },
  "bottom-left": {
    bottom: "var(--space-10)",
    left: "50%",
    transform: "translateX(-50%)",
    textAlign: "center",
  },
  "bottom-right": {
    bottom: "var(--space-10)",
    right: "var(--space-10)",
    textAlign: "right",
  },
};

export default function AmbientMedia({
  media,
  overlay,
  aspectRatio = "16/9",
}: AmbientMediaProps) {
  const sectionRef = useAmbientParallaxGsap();
  const [campaignData, setCampaignData] = useState<any>(null);

  useEffect(() => {
    getCampaign().then(setCampaignData);
  }, []);

  const resolvedSrc = campaignData?.image ?? media.src;
  const resolvedText = campaignData?.title ?? overlay?.text;

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio,
        overflow: "hidden",
        backgroundColor: "#0a0a0a",
      }}
    >
      {media.type === "video" ? (
        <video
          data-ambient-media
          src={resolvedSrc}
          poster={media.poster}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "-10% 0",
            width: "100%",
            height: "120%",
            objectFit: "cover",
          }}
        />
      ) : (
        <img
          data-ambient-media
          src={resolvedSrc}
          alt={media.alt}
          style={{
            position: "absolute",
            inset: "-10% 0",
            width: "100%",
            height: "120%",
            objectFit: "cover",
          }}
        />
      )}

      {overlay && (
        <div
          data-ambient-overlay
          style={{
            position: "absolute",
            zIndex: 1,
            ...overlayPositionStyles[overlay.position],
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-xs)",
              fontWeight: 300,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            {resolvedText}
          </span>
        </div>
      )}
    </section>
  );
}