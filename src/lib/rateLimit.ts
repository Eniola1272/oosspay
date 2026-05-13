import { NextRequest, NextResponse } from "next/server";

type Entry = { count: number; resetAt: number };
const store = new Map<string, Entry>();

// Prune stale entries every 5 minutes to prevent unbounded memory growth
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 5 * 60 * 1000);

/**
 * Simple in-process rate limiter.
 * Returns a 429 NextResponse if the limit is exceeded, otherwise null.
 *
 * @param req      Incoming request (IP extracted from x-forwarded-for)
 * @param key      Identifier for the route (e.g. "newsletter")
 * @param limit    Max requests per window
 * @param windowMs Window duration in milliseconds
 */
export function rateLimit(
  req: NextRequest,
  key: string,
  limit: number,
  windowMs: number,
): NextResponse | null {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const storeKey = `${key}:${ip}`;
  const now = Date.now();

  const entry = store.get(storeKey);
  if (!entry || entry.resetAt < now) {
    store.set(storeKey, { count: 1, resetAt: now + windowMs });
    return null;
  }

  entry.count += 1;
  if (entry.count > limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfter) },
      }
    );
  }

  return null;
}
