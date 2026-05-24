/* ═══════════════════════════════════════════════════
   ENV CONFIG — Typed environment variables
   ═══════════════════════════════════════════════════
   All env access funneled through this module.
   Vite exposes VITE_* vars on import.meta.env
   ═══════════════════════════════════════════════════ */

export type DataSourceType = "json" | "strapi" | "rest";

export const env = {
  /** Base URL for all API calls (no trailing slash) */
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL as string) || "",

  /** Which data source to use */
  dataSource: ((import.meta.env.VITE_DATA_SOURCE as string) || "json") as DataSourceType,

  /** Strapi bearer token */
  strapiToken: (import.meta.env.VITE_STRAPI_TOKEN as string) || "",

  /** Auth service base URL (no trailing slash) */
  authBaseUrl: (import.meta.env.VITE_AUTH_BASE_URL as string) || "",

  /** Stripe publishable key (pk_test_ or pk_live_) */
  stripePublishableKey: (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string) || "",

  /** Stripe backend API URL (no trailing slash) */
  stripeApiUrl: (import.meta.env.VITE_STRIPE_API_URL as string) || "",

  /** True when running `vite` dev server */
  isDev: import.meta.env.DEV,
} as const;