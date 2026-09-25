import "dotenv/config";

import { db } from "../db.js";

import { loadInitialData } from "./loaders/intial-data.js";

import { seedTenant } from "./modules/tenant.js";
import { seedDepartments } from "./modules/departments.js";
import { seedEmployees } from "./modules/employees.js";
import { seedEmployeeDepartments } from "./modules/employee-departments.js";

// ============================================================================
// SEED
// ============================================================================

async function seed(): Promise<void> {
  console.log("🌱 Starting Apollonia seed...");

  // --------------------------------------------------------------------------
  // LOAD
  // --------------------------------------------------------------------------

  const data = await loadInitialData();

  console.log(
    [
      "📦 Seed data loaded:",
      `   Departments: ${data.departments.length}`,
      `   Employees: ${data.employees.length}`,
      `   Employee/Department assignments: ${data.employee_departments.length}`,
    ].join("\n"),
  );

  // --------------------------------------------------------------------------
  // TENANT
  // --------------------------------------------------------------------------

  const tenant = await seedTenant();

  console.log(`🏢 Tenant ready: ${tenant.name} (${tenant.slug})`);

  // --------------------------------------------------------------------------
  // TRANSACTION
  // --------------------------------------------------------------------------
  //
  // Prisma ORM 8 Contract API:
  //
  //   db.transaction(...)
  //
  // NOT:
  //
  //   db.$transaction(...)
  //
  // All tenant-owned seed operations are executed atomically.
  // If any operation fails, the transaction is rolled back.
  // --------------------------------------------------------------------------

  await db.transaction(async (tx) => {
    await seedDepartments(tx, tenant.id, data.departments);

    await seedEmployees(tx, tenant.id, data.employees);

    await seedEmployeeDepartments(tx, tenant.id, data.employee_departments);
  });

  // --------------------------------------------------------------------------
  // COMPLETE
  // --------------------------------------------------------------------------

  console.log("✅ Apollonia PostgreSQL 18 / Prisma 8 seed completed");
}

// ============================================================================
// ENTRYPOINT
// ============================================================================

void seed().catch((error: unknown) => {
  console.error("❌ Seed failed:", error);

  process.exitCode = 1;
});
