import { DbTransaction } from "../../db.js";
import type { InitialDepartment } from "../seed.types.js";

// ============================================================================
// DEPARTMENT SEED
// ============================================================================
//
// Department uniqueness:
//
//   @@unique([tenantId, departmentCode])
//
//
// ============================================================================

export async function seedDepartments(
  tx: DbTransaction,
  tenantId: string,
  departments: InitialDepartment[],
): Promise<void> {
  for (const department of departments) {
    await tx.orm.public.Department.upsert({
      conflictOn: {
        tenantId,
        departmentCode: department.department_id,
      },

      update: {
        name: department.name,
      },

      create: {
        tenantId,
        departmentCode: department.department_id,
        name: department.name,
      },
    });
  }
}
