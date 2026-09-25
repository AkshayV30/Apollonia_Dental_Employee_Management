import { db } from "../../db.js";
import { TENANT } from "../seed.config.js";

// ============================================================================
// TENANT SEED
// ============================================================================
//
// Creates the Apollonia tenant if it does not exist.
//
// If the tenant already exists, its name is synchronized with the
// configured seed value.
//
// Tenant identity is determined by the unique `slug` field.
// ============================================================================

export async function seedTenant() {
  return db.orm.public.Tenant.upsert({
    conflictOn: {
      slug: TENANT.slug,
    },

    update: {
      name: TENANT.name,
    },

    create: {
      name: TENANT.name,
      slug: TENANT.slug,
    },
  });
}
