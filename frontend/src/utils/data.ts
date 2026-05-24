/* ═══════════════════════════════════════════════════
   DATA LAYER — Source-agnostic product fetching
   ═══════════════════════════════════════════════════
   Single entry point: getProducts()
   Source controlled by VITE_DATA_SOURCE env var:
     "json"   → local products.json (always works offline)
     "strapi" → Strapi v4 API with populate
     "rest"   → custom REST endpoint
   Falls back to JSON on any remote failure.
   ═══════════════════════════════════════════════════ */

import type { Product } from "../types/sections";
import { env } from "../config/env.config";
import { get } from "./api";
import fallbackProducts from "../data/products.json";

// ─── Strapi v4 response shape ────────────────────────

interface StrapiAttributes {
  name: string;
  sub: string;
  price: number;
  tag?: string;
  category: string;
  stock: number;
  images: { data: { attributes: { url: string } }[] };
  variants: { id: string; label: string; value: string; stock: number }[];
}

interface StrapiResponse {
  data: { id: number; attributes: StrapiAttributes }[];
}

function normalizeStrapiProduct(item: any): Product {
  return {
    id: String(item.id),
    name: item.name,
    sub: item.subtitle,
    price: item.price,
    tag: item.tag,
    category: item.category,
    stock: item.stock,
    images: item.images?.map((img: any) =>
      img.url?.startsWith('http')
        ? img.url
        : `${import.meta.env.VITE_API_BASE_URL}${img.url}`
    ) ?? [],
    variants: item.variants ?? [],
  };
}

// ─── Source fetchers ─────────────────────────────────

async function fromJSON(): Promise<Product[]> {
  return fallbackProducts as Product[];
}

async function fromStrapi(): Promise<Product[]> {
  const res = await get<StrapiResponse>("/api/products?populate=*", {
    headers: env.strapiToken
      ? { Authorization: `Bearer ${env.strapiToken}` }
      : {},
  });
  return res.data.map(normalizeStrapiProduct);
}

async function fromRest(): Promise<Product[]> {
  return get<Product[]>("/api/products");
}

// ─── Public API ──────────────────────────────────────

/**
 * Fetches products from the configured data source.
 * Automatically falls back to local JSON on failure.
 */
export async function getProducts(): Promise<Product[]> {
  const source = env.dataSource;

  if (source === "json") {
    return fromJSON();
  }

  try {
    switch (source) {
      case "strapi":
        return await fromStrapi();
      case "rest":
        return await fromRest();
      default:
        return fromJSON();
    }
  } catch (err) {
    console.warn(
      `[data] ${source} fetch failed, falling back to local JSON.`,
      err,
    );
    return fromJSON();
  }
}

// ─── Hero Media ──────────────────────────────────────

export async function getHeroMedia() {
  if (env.dataSource === "strapi" && env.apiBaseUrl) {
    try {
      const res = await fetch(
        `${env.apiBaseUrl}/api/hero-media?populate=*`,
        {
          headers: env.strapiToken
            ? { Authorization: `Bearer ${env.strapiToken}` }
            : {},
        }
      );
      const json = await res.json();
      const d = json.data;
      return {
        title: d.title ?? null,
        subtitle: d.subtitle ?? null,
        ctaText: d.ctaText ?? null,
        image: d.image?.url
          ? d.image.url.startsWith("http")
            ? d.image.url
            : `${env.apiBaseUrl}${d.image.url}`
          : null,
      };
    } catch (e) {
      console.warn("[data] heroMedia strapi fetch failed", e);
      return null;
    }
  }
  return null;
}

// ─── Campaign ─────────────────────────────────────────

export async function getCampaign() {
  if (env.dataSource === "strapi" && env.apiBaseUrl) {
    try {
      const res = await fetch(
        `${env.apiBaseUrl}/api/campaign?populate=*`,
        {
          headers: env.strapiToken
            ? { Authorization: `Bearer ${env.strapiToken}` }
            : {},
        }
      );
      const json = await res.json();
      const d = json.data;
      return {
        title: d.title ?? null,
        subtitle: d.subtitle ?? null,
        ctaText: d.ctaText ?? null,
        image: d.image?.url
          ? d.image.url.startsWith("http")
            ? d.image.url
            : `${env.apiBaseUrl}${d.image.url}`
          : null,
      };
    } catch (e) {
      console.warn("[data] campaign strapi fetch failed", e);
      return null;
    }
  }
  return null;
}

// ─── Gallery ──────────────────────────────────────────

export async function getGallery() {
  if (env.dataSource === "strapi" && env.apiBaseUrl) {
    try {
      const res = await fetch(
        `${env.apiBaseUrl}/api/gallery?populate=*`,
        {
          headers: env.strapiToken
            ? { Authorization: `Bearer ${env.strapiToken}` }
            : {},
        }
      );
      const json = await res.json();
      const d = json.data;
      return {
        images: d.images?.map((img: any) =>
          img.url?.startsWith("http")
            ? img.url
            : `${env.apiBaseUrl}${img.url}`
        ) ?? [],
      };
    } catch (e) {
      console.warn("[data] gallery strapi fetch failed", e);
      return null;
    }
  }
  return null;
}

// ─── Editorial Quote ──────────────────────────────────

export async function getEditorialQuote() {
  if (env.dataSource === "strapi" && env.apiBaseUrl) {
    try {
      const res = await fetch(
        `${env.apiBaseUrl}/api/editorial-quote`,
        {
          headers: env.strapiToken
            ? { Authorization: `Bearer ${env.strapiToken}` }
            : {},
        }
      );
      const json = await res.json();
      const d = json.data;
      return {
        quote: d.quote ?? null,
        attribution: d.attribution ?? null,
      };
    } catch (e) {
      console.warn("[data] editorialQuote strapi fetch failed", e);
      return null;
    }
  }
  return null;
}

// ─── Footer Settings ──────────────────────────────────

export async function getFooterSettings() {
  if (env.dataSource === "strapi" && env.apiBaseUrl) {
    try {
      const res = await fetch(
        `${env.apiBaseUrl}/api/footer-setting`,
        {
          headers: env.strapiToken
            ? { Authorization: `Bearer ${env.strapiToken}` }
            : {},
        }
      );
      const json = await res.json();
      const d = json.data;
      return {
        logo: d.logo ?? null,
        copyright: d.copyright ?? null,
      };
    } catch (e) {
      console.warn("[data] footerSettings strapi fetch failed", e);
      return null;
    }
  }
  return null;
}

// ─── About Page ──────────────────────────────────────

export async function getAboutPage() {
  if (env.dataSource === "strapi" && env.apiBaseUrl) {
    try {
      const res = await fetch(
        `${env.apiBaseUrl}/api/about-page?populate=*`,
        {
          headers: env.strapiToken
            ? { Authorization: `Bearer ${env.strapiToken}` }
            : {},
        }
      );
      const json = await res.json();
      const d = json.data;
      return {
        title: d.title ?? null,
        subtitle: d.subtitle ?? null,
        story: d.story ?? null,
        values: d.values ?? null,
        image: d.image?.url
          ? d.image.url.startsWith("http")
            ? d.image.url
            : `${env.apiBaseUrl}${d.image.url}`
          : null,
      };
    } catch (e) {
      console.warn("[data] aboutPage strapi fetch failed", e);
      return null;
    }
  }
  return null;
}

// ─── Contact Page ────────────────────────────────────

export async function getContactPage() {
  if (env.dataSource === "strapi" && env.apiBaseUrl) {
    try {
      const res = await fetch(
        `${env.apiBaseUrl}/api/contact-page`,
        {
          headers: env.strapiToken
            ? { Authorization: `Bearer ${env.strapiToken}` }
            : {},
        }
      );
      const json = await res.json();
      const d = json.data;
      return {
        title: d.title ?? null,
        subtitle: d.subtitle ?? null,
        description: d.description ?? null,
        email: d.email ?? null,
        phone: d.phone ?? null,
        address: d.address ?? null,
      };
    } catch (e) {
      console.warn("[data] contactPage strapi fetch failed", e);
      return null;
    }
  }
  return null;
}