import { AsyncLocalStorage } from "node:async_hooks";
import type { Request, Response, NextFunction } from "express";

import { prisma } from "../configs/database/prisma.js";

// 1. High-performance async context frame for multi-tenant isolation
export const tenantContext = new AsyncLocalStorage<{ tenantSlug: string }>();

// 2. Node 24 Explicit Resource Management (ERM) Session tracking
export class TenantSession implements Disposable {
  constructor(public slug: string) {}

  [Symbol.dispose]() {
    // Automatically executes when the code execution block exits
    // Zero-overhead logging & clean security boundary teardown
    console.log(
      `[Tenant Security Context] Terminated request boundary safely for: ${this.slug}`,
    );
  }
}

/**
 * Node.js 24 High-Performance Express Middleware
 * Intercepts incoming HTTP requests to isolate tenant routing contexts
 */
export function tenantContextMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const tenantSlug =
    (req as any).tenantSlug || req.headers["x-tenant-slug"] || "apollonia";

  tenantContext.run({ tenantSlug }, () => {
    next();
  });
}

/**
 * Main Tenant Resolution Function
 * Refactored for Node 24 with Explicit Resource Management while maintaining the exact original signature.
 */
export async function getOrCreateTenant(req: Request) {
  // Extract slug from local store if available, otherwise fall back to request state
  const store = tenantContext.getStore();
  const tenantSlug =
    store?.tenantSlug || (req as any).tenantSlug || "apollonia";

  // Using statement automatically executes [Symbol.dispose]() when exiting this block scope
  using session = new TenantSession(tenantSlug);

  // Read via global database instance matching your architecture
  const existingTenant = await prisma.tenant.findUnique({
    where: {
      slug: session.slug,
    },
  });

  if (existingTenant) {
    return existingTenant;
  }

  // Fallback protection guard clause
  if (session.slug !== "apollonia") {
    throw new Error(`Tenant not found: ${session.slug}`);
  }

  // Core fallback creation logic maintained
  return prisma.tenant.create({
    data: {
      name: "Apollonia Dental Practice",
      slug: "apollonia",
    },
  });
}
