import { Request } from "express";
import { prisma } from "../configs/database/prisma";

export async function getOrCreateTenant(req: Request) {
  const tenantSlug = (req as any).tenantSlug || "apollonia";

  const existingTenant = await prisma.tenant.findUnique({
    where: {
      slug: tenantSlug,
    },
  });

  if (existingTenant) {
    return existingTenant;
  }

  if (tenantSlug !== "apollonia") {
    throw new Error(`Tenant not found: ${tenantSlug}`);
  }

  return prisma.tenant.create({
    data: {
      name: "Apollonia Dental Practice",
      slug: "apollonia",
    },
  });
}
