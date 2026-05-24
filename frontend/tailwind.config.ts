import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],

  theme: {
    extend: {
      /* ── Colors (read from CSS variables) ─────────── */
      colors: {
        bg: {
          DEFAULT: "var(--bg)",
          alt: "var(--bg-alt)",
          card: "var(--bg-card)",
        },
        fg: {
          DEFAULT: "var(--fg)",
          secondary: "var(--fg-secondary)",
          muted: "var(--fg-muted)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          soft: "var(--accent-soft)",
        },
        border: {
          DEFAULT: "var(--border)",
          strong: "var(--border-strong)",
        },
      },

      /* ── Typography ───────────────────────────────── */
      fontFamily: {
        display: "var(--font-display)",
        body: "var(--font-body)",
      },
      fontSize: {
        xs: "var(--text-xs)",
        sm: "var(--text-sm)",
        base: "var(--text-base)",
        lg: "var(--text-lg)",
        xl: "var(--text-xl)",
        "2xl": "var(--text-2xl)",
        "3xl": "var(--text-3xl)",
        "4xl": "var(--text-4xl)",
      },

      /* ── Spacing ──────────────────────────────────── */
      spacing: {
        1: "var(--space-1)",
        2: "var(--space-2)",
        3: "var(--space-3)",
        4: "var(--space-4)",
        5: "var(--space-5)",
        6: "var(--space-6)",
        8: "var(--space-8)",
        10: "var(--space-10)",
        12: "var(--space-12)",
        16: "var(--space-16)",
        20: "var(--space-20)",
      },

      /* ── Motion ───────────────────────────────────── */
      transitionTimingFunction: {
        soft: "var(--ease-soft)",
        expo: "var(--ease-expo)",
      },
      transitionDuration: {
        fast: "var(--duration-fast)",
        base: "var(--duration-base)",
        slow: "var(--duration-slow)",
      },

      /* ── Layout ───────────────────────────────────── */
      maxWidth: {
        page: "var(--max-width)",
      },
      height: {
        nav: "var(--nav-height)",
      },
      gap: {
        grid: "var(--grid-gap)",
      },
    },
  },

  plugins: [],
};

export default config;
