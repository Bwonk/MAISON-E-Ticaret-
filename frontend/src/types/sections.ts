/* ═══════════════════════════════════════════════════
   SECTION TYPE DEFINITIONS
   Single source of truth for all block contracts
   ═══════════════════════════════════════════════════ */

// ─── Product Domain ──────────────────────────────────

export interface ProductVariant {
  id: string;
  label: string;
  value: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  sub: string;
  price: number;
  tag?: string;
  images: string[];
  category: string;
  stock: number;
  variants: ProductVariant[];
}

// ─── Section Block Props ─────────────────────────────

export interface HeroMediaProps {
  type: "heroMedia";
  brandName: string;
  tagline?: string;
  media: {
    src: string;
    alt: string;
    type: "image" | "video";
    poster?: string;
  };
  cta?: {
    label: string;
    href: string;
  };
}

export interface ProductGridProps {
  type: "productGrid";
  heading?: string;
  products: Product[];
  initialCount?: number;
  loadMoreLabel?: string;
  onAddToCart?: (product: Product) => void;
}

export interface EditorialQuoteProps {
  type: "editorialQuote";
  quote: string;
  attribution?: string;
  accent?: boolean;
}

export interface AmbientMediaProps {
  type: "ambientMedia";
  media: {
    src: string;
    alt: string;
    type: "image" | "video";
    poster?: string;
  };
  overlay?: {
    text: string;
    position: "center" | "bottom-left" | "bottom-right";
  };
  aspectRatio?: string;
}

export interface StoryGalleryProps {
  type: "storyGallery";
  heading?: string;
  images: {
    src: string;
    alt: string;
    span?: "wide" | "tall" | "default";
  }[];
}

export interface FooterMinimalProps {
  type: "footerMinimal";
  logo: string;
  links: {
    label: string;
    href: string;
  }[];
  copyright?: string;
}

// ─── Union Type ──────────────────────────────────────

export type SectionBlock =
  | HeroMediaProps
  | ProductGridProps
  | EditorialQuoteProps
  | AmbientMediaProps
  | StoryGalleryProps
  | FooterMinimalProps;

// ─── Section Type Discriminator ──────────────────────

export type SectionType = SectionBlock["type"];

// ─── Page Config ─────────────────────────────────────

export interface PageConfig {
  meta: {
    title: string;
    description: string;
    theme: "ivory" | "noir" | "sage";
  };
  sections: SectionBlock[];
}

// ─── Data Source ──────────────────────────────────────

export type DataSource =
  | { type: "static"; path: string }
  | { type: "api"; endpoint: string; headers?: Record<string, string> };
