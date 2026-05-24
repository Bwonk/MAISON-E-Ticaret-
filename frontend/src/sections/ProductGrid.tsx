/* ═══════════════════════════════════════════════════
   PRODUCT GRID — LORE-style horizontal slider
   ═══════════════════════════════════════════════════
   Horizontal scroll carousel with snap points.
   Works gracefully with 1, 2, or many products.
   Each card has a "+" add-to-cart button.
   ═══════════════════════════════════════════════════ */

import { useState, useRef, useCallback } from "react";
import type { ProductGridProps, Product } from "../types/sections";
import { useGridRevealGsap } from "../hooks/useGsap";

// ─── Product Card ───────────────────────────────────

function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart?: (product: Product) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      data-grid-item
      style={{
        flex: "0 0 auto",
        width: "min(340px, 80vw)",
        scrollSnapAlign: "start",
        cursor: "default",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image + Add button */}
      {product.images[0] && (
        <div
          style={{
            position: "relative",
            aspectRatio: "3/4",
            overflow: "hidden",
            backgroundColor: "var(--bg-alt)",
            marginBottom: "var(--space-5)",
          }}
        >
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform var(--duration-slow) var(--ease-expo)",
              transform: hovered ? "scale(1.03)" : "scale(1)",
            }}
          />

          {/* Tag badge */}
          {product.tag && (
            <span
              style={{
                position: "absolute",
                top: "var(--space-4)",
                left: "var(--space-4)",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-xs)",
                fontWeight: 400,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--bg)",
                backgroundColor: "var(--fg)",
                padding: "var(--space-1) var(--space-3)",
              }}
            >
              {product.tag}
            </span>
          )}

          {/* Add to cart button */}
          {onAddToCart && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              aria-label={`${product.name} sepete ekle`}
              style={{
                position: "absolute",
                bottom: "var(--space-4)",
                right: "var(--space-4)",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "var(--fg)",
                color: "var(--bg)",
                border: "none",
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: "var(--text-xl)",
                fontWeight: 300,
                lineHeight: 1,
                opacity: hovered ? 1 : 0,
                transform: hovered ? "translateY(0)" : "translateY(8px)",
                transition: "all var(--duration-base) var(--ease-expo)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
              }}
            >
              +
            </button>
          )}
        </div>
      )}

      {/* Product info */}
      <div>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-base)",
            fontWeight: 400,
            fontStyle: "italic",
            color: "var(--fg)",
            lineHeight: 1.35,
          }}
        >
          {product.name}
        </h3>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-xs)",
            fontWeight: 300,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--fg-muted)",
            marginTop: "var(--space-1)",
          }}
        >
          {product.sub}
        </p>

        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
            fontWeight: 300,
            color: "var(--fg-secondary)",
            letterSpacing: "0.02em",
            display: "inline-block",
            marginTop: "var(--space-3)",
          }}
        >
          ${product.price}
        </span>
      </div>
    </article>
  );
}

// ─── Slider Nav Arrow ───────────────────────────────

function SliderArrow({
  direction,
  onClick,
  visible,
}: {
  direction: "left" | "right";
  onClick: () => void;
  visible: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={direction === "left" ? "Önceki" : "Sonraki"}
      style={{
        position: "absolute",
        top: "50%",
        [direction === "left" ? "left" : "right"]: "var(--space-3)",
        transform: "translateY(-50%)",
        width: "44px",
        height: "44px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--bg)",
        color: "var(--fg)",
        border: "1px solid var(--border)",
        borderRadius: "50%",
        cursor: "pointer",
        fontSize: "var(--text-lg)",
        fontWeight: 300,
        lineHeight: 1,
        opacity: visible ? 0.9 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "all var(--duration-base) var(--ease-soft)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        zIndex: 2,
      }}
    >
      {direction === "left" ? "\u2190" : "\u2192"}
    </button>
  );
}

// ─── Main Component ─────────────────────────────────

export default function ProductGrid({
  heading,
  products,
  onAddToCart,
}: ProductGridProps) {
  const sectionRef = useGridRevealGsap();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [sliderHovered, setSliderHovered] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  const scrollBy = useCallback((dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.7;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  }, []);

  // Single product → centered, no scroll
  const isSingle = products.length === 1;

  return (
    <section
      ref={sectionRef}
      id="collection"
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
        {/* Header row */}
        {heading && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: "var(--space-12)",
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
              {heading}
            </span>
            {products.length > 2 && (
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 300,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--fg-muted)",
                  cursor: "pointer",
                  transition: "color var(--duration-fast) var(--ease-soft)",
                }}
              >
                Tümünü Gör &rarr;
              </span>
            )}
          </div>
        )}

        {/* Slider container */}
        <div
          style={{ position: "relative" }}
          onMouseEnter={() => {
            setSliderHovered(true);
            checkScroll();
          }}
          onMouseLeave={() => setSliderHovered(false)}
        >
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            style={{
              display: "flex",
              gap: "var(--space-6)",
              overflowX: isSingle ? "visible" : "auto",
              scrollSnapType: "x mandatory",
              scrollBehavior: "smooth",
              paddingBottom: "var(--space-4)",
              /* Hide scrollbar */
              scrollbarWidth: "none",
              justifyContent: isSingle ? "center" : "flex-start",
            }}
          >
            {/* Hide webkit scrollbar via inline workaround — using a class would be cleaner but we stay inline */}
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>

          {/* Navigation arrows — only for 3+ products */}
          {!isSingle && products.length > 2 && (
            <>
              <SliderArrow
                direction="left"
                onClick={() => scrollBy("left")}
                visible={sliderHovered && canScrollLeft}
              />
              <SliderArrow
                direction="right"
                onClick={() => scrollBy("right")}
                visible={sliderHovered && canScrollRight}
              />
            </>
          )}
        </div>
      </div>

      {/* Hide scrollbar for webkit — injected once */}
      <style>{`
        #collection [style*="overflow"] {
          -ms-overflow-style: none;
        }
        #collection [style*="overflow"]::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
