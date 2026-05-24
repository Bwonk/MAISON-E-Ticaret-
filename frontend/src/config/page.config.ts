/* ═══════════════════════════════════════════════════
   PAGE CONFIG — Single source of truth for page order
   ═══════════════════════════════════════════════════
   Reordering = moving one line. Zero component changes.
   Products are injected at runtime via data.ts
   ═══════════════════════════════════════════════════ */

import type { PageConfig } from "../types/sections";

const pageConfig: PageConfig = {
  meta: {
    title: "MAISON — Editöryal Koleksiyon",
    description: "Özenle seçilmiş, rafine parçalar.",
    theme: "ivory",
  },

  sections: [
    // ─── 1. Hero ───────────────────────────────────
    {
      type: "heroMedia",
      brandName: "MAISON",
      tagline: "Bilinçli yaşam için rafine parçalar",
      media: {
        src: "/media/hero.jpg",
        alt: "Kampanya görseli — sezon koleksiyonu",
        type: "image",
      },
      cta: {
        label: "Koleksiyonu Keşfet",
        href: "#collection",
      },
    },

    // ─── 2. Product Grid ───────────────────────────
    // products[] injected at runtime — see src/utils/data.ts
    {
      type: "productGrid",
      heading: "Koleksiyon",
      products: [],
      initialCount: 6,
      loadMoreLabel: "Daha Fazla",
    },

    // ─── 3. Editorial Quote ────────────────────────
    {
      type: "editorialQuote",
      quote: "Lüks, daha fazlasına sahip olmak değil — bilinçli seçim yapmaktır.",
      attribution: "The House",
      accent: true,
    },

    // ─── 4. Ambient Media ──────────────────────────
    {
      type: "ambientMedia",
      media: {
        src: "/media/ambient.jpg",
        alt: "Yaşam tarzı kampanya görseli",
        type: "image",
      },
      overlay: {
        text: "İkinci Sezon",
        position: "bottom-left",
      },
      aspectRatio: "21/9",
    },

    // ─── 5. Story Gallery ──────────────────────────
    {
      type: "storyGallery",
      heading: "Süreç",
      images: [
        { src: "/media/story-1.jpg", alt: "Malzeme seçimi", span: "wide" },
        { src: "/media/story-2.jpg", alt: "Atölye işçiliği" },
        { src: "/media/story-3.jpg", alt: "Detay çalışması" },
        { src: "/media/story-4.jpg", alt: "Kalite kontrol" },
        { src: "/media/story-5.jpg", alt: "Son ürün", span: "wide" },
        { src: "/media/story-6.jpg", alt: "Paketleme" },
      ],
    },

    // ─── 6. Footer ─────────────────────────────────
    {
      type: "footerMinimal",
      logo: "MAISON",
      links: [
        { label: "Mağaza", href: "/shop" },
        { label: "Hakkımızda", href: "/about" },
        { label: "Dergi", href: "/journal" },
        { label: "İletişim", href: "/contact" },
      ],
      copyright: "© 2026 Maison. Tüm hakları saklıdır.",
    },
  ],
};

export default pageConfig;
