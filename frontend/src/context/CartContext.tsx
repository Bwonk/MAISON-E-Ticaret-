/* ═══════════════════════════════════════════════════
   CART CONTEXT — Global cart state + localStorage
   ═══════════════════════════════════════════════════ */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { Product } from "../types/sections";

// ─── Types ──────────────────────────────────────────

export interface CartItem {
  productId: string;
  name: string;
  sub: string;
  price: number;
  image: string;
  variantId?: string;
  variantLabel?: string;
  quantity: number;
  maxStock: number;
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Product, variantId?: string, quantity?: number) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
}

// ─── Storage ────────────────────────────────────────

const STORAGE_KEY = "maison_cart";

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* quota exceeded — silently ignore */
  }
}

// ─── Key helper ─────────────────────────────────────

function itemKey(productId: string, variantId?: string) {
  return variantId ? `${productId}::${variantId}` : productId;
}

// ─── Context ────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  // Persist on every change
  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addToCart = useCallback(
    (product: Product, variantId?: string, quantity = 1) => {
      setItems((prev) => {
        const key = itemKey(product.id, variantId);
        const idx = prev.findIndex(
          (it) => itemKey(it.productId, it.variantId) === key
        );

        const variant = variantId
          ? product.variants.find((v) => v.id === variantId)
          : undefined;

        const rawStock = variant?.stock ?? product.stock;
        const maxStock = rawStock > 0 ? rawStock : 999;

        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = {
            ...updated[idx],
            quantity: Math.min(updated[idx].quantity + quantity, maxStock),
          };
          return updated;
        }

        return [
          ...prev,
          {
            productId: product.id,
            name: product.name,
            sub: product.sub,
            price: product.price,
            image: product.images[0] ?? "",
            variantId,
            variantLabel: variant?.value,
            quantity: Math.min(quantity, maxStock),
            maxStock,
          },
        ];
      });
    },
    []
  );

  const removeFromCart = useCallback(
    (productId: string, variantId?: string) => {
      setItems((prev) => {
        const key = itemKey(productId, variantId);
        return prev.filter(
          (it) => itemKey(it.productId, it.variantId) !== key
        );
      });
    },
    []
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number, variantId?: string) => {
      if (quantity <= 0) {
        removeFromCart(productId, variantId);
        return;
      }
      setItems((prev) => {
        const key = itemKey(productId, variantId);
        return prev.map((it) =>
          itemKey(it.productId, it.variantId) === key
            ? { ...it, quantity: Math.min(quantity, it.maxStock) }
            : it
        );
      });
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((sum, it) => sum + it.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.quantity, 0),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalItems,
      totalPrice,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [items, totalItems, totalPrice, addToCart, removeFromCart, updateQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
