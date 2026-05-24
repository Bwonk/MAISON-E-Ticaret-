import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // Relative paths — required for S3/CloudFront
  base: "/",

  build: {
    outDir: "dist",
    sourcemap: false,

    rollupOptions: {
      output: {
        // Code splitting: vendor + app chunks
        manualChunks: {
          "vendor-react": ["react", "react-dom"],
          "vendor-gsap": ["gsap"],
        },
      },
    },

    // Inline assets smaller than 4KB
    assetsInlineLimit: 4096,
  },

  server: {
    port: 5173,
    strictPort: false,
  },
});
