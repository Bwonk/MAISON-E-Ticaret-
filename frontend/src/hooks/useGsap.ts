/* ═══════════════════════════════════════════════════
   GSAP ANIMATION HOOKS — Editorial Motion System
   ═══════════════════════════════════════════════════
   Each hook is self-contained. ScrollTrigger is killed
   on unmount. Reduced motion is respected globally.
   ═══════════════════════════════════════════════════ */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Reduced Motion ──────────────────────────────────

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// ─── Hero Media — fade + translate brand, tagline, cta ─

export function useHeroMediaGsap() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const targets = el.querySelectorAll("[data-hero-animate]");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.15,
          delay: 0.3,
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}

// ─── Grid Reveal — stagger cards on scroll ───────────

export function useGridRevealGsap() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const cards = el.querySelectorAll("[data-grid-item]");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            once: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}

// ─── Quote Fill — text reveal on scroll ──────────────

export function useQuoteFillGsap() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const quote = el.querySelector("[data-quote-text]");
    const attr = el.querySelector("[data-quote-attr]");

    const ctx = gsap.context(() => {
      if (quote) {
        gsap.fromTo(
          quote,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: el,
              start: "top 75%",
              once: true,
            },
          },
        );
      }

      if (attr) {
        gsap.fromTo(
          attr,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.8,
            delay: 0.4,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 75%",
              once: true,
            },
          },
        );
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}

// ─── Ambient Parallax — subtle vertical shift ────────

export function useAmbientParallaxGsap() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const media = el.querySelector("[data-ambient-media]");

    const ctx = gsap.context(() => {
      if (media) {
        gsap.fromTo(
          media,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }

      // Overlay text fade
      const overlay = el.querySelector("[data-ambient-overlay]");
      if (overlay) {
        gsap.fromTo(
          overlay,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "expo.out",
            scrollTrigger: {
              trigger: el,
              start: "top 60%",
              once: true,
            },
          },
        );
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}

// ─── Gallery Reveal — stagger images on scroll ───────

export function useGalleryRevealGsap() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const images = el.querySelectorAll("[data-gallery-item]");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        images,
        { opacity: 0, y: 40, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            once: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}
