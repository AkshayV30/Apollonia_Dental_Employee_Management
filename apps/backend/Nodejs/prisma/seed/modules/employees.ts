import { DbTransaction } from "../../db.js";
import {
  normalizeExperience,
  parseDate,
} from "../loaders/parsers/seed-values.js";

import type { InitialEmployee } from "../seed.types.js";

// ============================================================================
// EMPLOYEE SEED
// ============================================================================
//
// Employee uniqueness:
//
//   @@unique([tenantId, employeeCode])
//
// Prisma ORM 8 Contract API:
//
//   conflictOn: {
//     tenantId,
//     employeeCode,
//   }
//
// ============================================================================

export async function seedEmployees(
  tx: DbTransaction,
  tenantId: string,
  employees: InitialEmployee[],
): Promise<void> {
  for (const employee of employees) {
    const dateOfJoining = parseDate(employee.date_of_joining);

    const yearsOfExperience = normalizeExperience(employee.years_of_experience);

    await tx.orm.public.Employee.upsert({
      conflictOn: {
        tenantId,
        employeeCode: employee.employee_id,
      },

      update: {
        firstName: employee.first_name,
        lastName: employee.last_name,
        dateOfJoining,
        specialization: employee.specialization ?? null,
        yearsOfExperience,
        backgroundInfo: employee.background_info ?? null,
      },

      create: {
        tenantId,
        employeeCode: employee.employee_id,
        firstName: employee.first_name,
        lastName: employee.last_name,
        dateOfJoining,
        specialization: employee.specialization ?? null,
        yearsOfExperience,
        backgroundInfo: employee.background_info ?? null,
      },
    });
  }
}
