/* ═══════════════════════════════════════════════════
   HTTP CLIENT — Thin fetch wrapper
   ═══════════════════════════════════════════════════
   Centralizes base URL, headers, error handling.
   Every outbound request goes through here.
   ═══════════════════════════════════════════════════ */

import { env } from "../config/env.config";

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public url: string,
  ) {
    super(`[${status}] ${statusText} — ${url}`);
    this.name = "ApiError";
  }
}

interface RequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

/**
 * GET request against the configured base URL.
 * @param path  — relative path, e.g. "/api/products"
 */
export async function get<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const url = `${env.apiBaseUrl}${path}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...opts.headers,
    },
    signal: opts.signal,
  });

  if (!res.ok) throw new ApiError(res.status, res.statusText, url);

  return res.json();
}
