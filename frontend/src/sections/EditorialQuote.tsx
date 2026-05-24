import { useEffect, useState } from "react";
import type { EditorialQuoteProps } from "../types/sections";
import { useQuoteFillGsap } from "../hooks/useGsap";
import { getEditorialQuote } from "../utils/data";

export default function EditorialQuote({
  quote,
  attribution,
}: EditorialQuoteProps) {
  const sectionRef = useQuoteFillGsap();
  const [quoteData, setQuoteData] = useState<any>(null);

  useEffect(() => {
    getEditorialQuote().then(setQuoteData);
  }, []);

  const resolvedQuote = quoteData?.quote ?? quote;
  const resolvedAttribution = quoteData?.attribution ?? attribution;

  return (
    <section
      ref={sectionRef}
      style={{
        backgroundColor: "var(--bg)",
        padding: "var(--space-32) var(--space-8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <blockquote style={{ textAlign: "center" }}>
        <p
          data-quote-text
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(var(--text-xl), 3vw, var(--text-2xl))",
            fontWeight: 400,
            fontStyle: "italic",
            lineHeight: 1.45,
            letterSpacing: "0.01em",
            color: "var(--fg)",
          }}
        >
          {resolvedQuote}
        </p>

        {resolvedAttribution && (
          <footer
            data-quote-attr
            style={{
              marginTop: "var(--space-5)",
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-xs)",
              fontWeight: 400,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--fg-muted)",
            }}
          >
            {resolvedAttribution} &#9670;
          </footer>
        )}
      </blockquote>
    </section>
  );
}