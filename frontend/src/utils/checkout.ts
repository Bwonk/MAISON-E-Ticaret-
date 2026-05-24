/* ═══════════════════════════════════════════════════
   CHECKOUT UTILITIES — Order creation + Stripe redirect
   ═══════════════════════════════════════════════════
   Frontend never touches card data.
   Flow: createCheckoutSession() → Stripe redirect
   Dev mode returns a mocked session for offline work.
   ═══════════════════════════════════════════════════ */

import { env } from "../config/env.config";
import { getToken } from "./auth";

// ─── Types ───────────────────────────────────────────

export interface CheckoutCustomer {
  email: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface CheckoutPayload {
  productId: string;
  variant: string;
  quantity: number;
  customer: CheckoutCustomer;
}

export interface CheckoutSession {
  orderId: string;
  sessionId: string;
  url: string;
}

// ─── Error ───────────────────────────────────────────

export class CheckoutError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "CheckoutError";
  }
}

// ─── Mock for dev mode ───────────────────────────────

const MOCK_SESSION: CheckoutSession = {
  orderId: "mock-order-001",
  sessionId: "cs_test_mock_session",
  url: "/order/success?session_id=cs_test_mock_session&mock=true",
};

// ─── API call ────────────────────────────────────────

export async function createCheckoutSession(
  payload: CheckoutPayload,
): Promise<CheckoutSession> {
  // Dev mode → return mock, no network
  if (env.isDev && !env.stripeApiUrl) {
    console.info("[checkout] Dev mode — returning mocked session.");
    return MOCK_SESSION;
  }

  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${env.stripeApiUrl}/api/checkout/session`;
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new CheckoutError(
      res.status,
      (body as { message?: string }).message || `${res.status} ${res.statusText}`,
    );
  }

  return res.json();
}

// ─── Stripe redirect ────────────────────────────────

export async function redirectToStripe(sessionUrl: string): Promise<void> {
  // The backend returns a full Stripe Checkout URL
  // Simply navigate — no card data touches the frontend
  window.location.href = sessionUrl;
}