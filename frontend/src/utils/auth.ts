/* ═══════════════════════════════════════════════════
   AUTH UTILITIES — JWT token + auth API calls
   ═══════════════════════════════════════════════════
   All auth HTTP requests funnel through here.
   Token persistence: localStorage.
   ═══════════════════════════════════════════════════ */

import { env } from "../config/env.config";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

// ─── Types ───────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: AuthUser;
}

interface ApiErrorBody {
  message?: string;
}

// ─── Auth Error ──────────────────────────────────────

export class AuthError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

// ─── Internal fetch helper ───────────────────────────

async function authFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${env.authBaseUrl}${path}`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const body: ApiErrorBody = await res.json().catch(() => ({}));
    throw new AuthError(
      res.status,
      body.message || `${res.status} ${res.statusText}`,
    );
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ─── Token management ────────────────────────────────

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function persistSession(token: string, user: AuthUser): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// ─── Public API ──────────────────────────────────────

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const data = await authFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  persistSession(data.token, data.user);
  return data;
}

export async function register(payload: RegisterPayload): Promise<{ message: string }> {
  return authFetch<{ message: string }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function resendVerification(email: string): Promise<{ message: string }> {
  return authFetch<{ message: string }>("/api/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}
