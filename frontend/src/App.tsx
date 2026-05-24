/* ═══════════════════════════════════════════════════
   APP — Section renderer + simple client-side router
   ═══════════════════════════════════════════════════
   Reads page.config.ts, injects products at runtime,
   and renders sections in declared order.
   ═══════════════════════════════════════════════════ */

import { useState, useEffect, useCallback } from "react";
import pageConfig from "./config/page.config";
import type { SectionBlock, Product } from "./types/sections";
import { getProducts } from "./utils/data";

// Sections
import HeroMedia from "./sections/HeroMedia";
import ProductGrid from "./sections/ProductGrid";
import EditorialQuote from "./sections/EditorialQuote";
import AmbientMedia from "./sections/AmbientMedia";
import StoryGallery from "./sections/StoryGallery";
import FooterMinimal from "./sections/FooterMinimal";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import OrderSuccess from "./pages/OrderSuccess";
import OrderFailed from "./pages/OrderFailed";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ComingSoon from "./pages/ComingSoon";

// Checkout + Cart
import CheckoutPanel from "./components/CheckoutPanel";
import CartDrawer from "./components/CartDrawer";
import CartIcon from "./components/CartIcon";
import { useCart } from "./context/CartContext";

// ─── Simple path router ──────────────────────────────

function useRoute() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    function onPop() {
      setPath(window.location.pathname);
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return path;
}

// ─── Section renderer ────────────────────────────────

function RenderSection({
  block,
  products,
  onProductSelect,
}: {
  block: SectionBlock;
  products: Product[];
  onProductSelect: (p: Product) => void;
}) {
  switch (block.type) {
    case "heroMedia":
      return <HeroMedia {...block} />;
    case "productGrid":
      return (
        <ProductGrid {...block} products={products} onAddToCart={onProductSelect} />
      );
    case "editorialQuote":
      return <EditorialQuote {...block} />;
    case "ambientMedia":
      return <AmbientMedia {...block} />;
    case "storyGallery":
      return <StoryGallery {...block} />;
    case "footerMinimal":
      return <FooterMinimal {...block} />;
  }
}


// ─── App ─────────────────────────────────────────────

export default function App() {
  const route = useRoute();
  const { items, addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  // Set theme from config
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", pageConfig.meta.theme);
    document.title = pageConfig.meta.title;
  }, []);

  // Fetch products once
  useEffect(() => {
    getProducts().then(setProducts).catch(console.error);
  }, []);

  // Product click → add to cart + open cart drawer
  const handleProductSelect = useCallback((product: Product) => {
    addToCart(product);
    setCartOpen(true);
  }, [addToCart]);

  // Cart "Proceed to Checkout" → open CheckoutPanel with all cart items
  const handleCartCheckout = useCallback(() => {
    if (items.length === 0) return;
    setCartOpen(false);
    setCheckoutOpen(true);
  }, [items]);

  // ─── Route pages ─────────────────────────────────
  if (route === "/login") return <Login />;
  if (route === "/register") return <Register />;
  if (route === "/order/success") return <OrderSuccess />;
  if (route === "/order/failed") return <OrderFailed />;
  if (route === "/about") return <About />;
  if (route === "/contact") return <Contact />;
  if (route === "/shop" || route === "/journal") return <ComingSoon />;

  // ─── Main page — render sections from config ─────
  return (
    <>
      {/* Floating cart icon — top-right */}
      <div
        style={{
          position: "fixed",
          top: "var(--space-5)",
          right: "var(--space-5)",
          zIndex: 900,
        }}
      >
        <CartIcon onClick={() => setCartOpen(true)} />
      </div>

      {pageConfig.sections.map((block, i) => (
        <RenderSection
          key={`${block.type}-${i}`}
          block={block}
          products={products}
          onProductSelect={handleProductSelect}
        />
      ))}

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={handleCartCheckout}
      />

      <CheckoutPanel
        items={items}
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </>
  );
}
