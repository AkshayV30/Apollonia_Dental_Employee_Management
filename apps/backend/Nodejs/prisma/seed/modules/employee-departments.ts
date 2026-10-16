import type { DbTransaction } from "../../db.js";
import type { EmployeeDepartmentLink } from "../seed.types.js";

// ============================================================================
// EMPLOYEE <-> DEPARTMENT SEED
// ============================================================================
//
// EmployeeDepartment is an explicit many-to-many relationship:
//
//   Employee <-> Department
//
// Contract:
//
//   @@id([employeeId, departmentId])
//

//
// ============================================================================

export async function seedEmployeeDepartments(
  tx: DbTransaction,
  tenantId: string,
  links: EmployeeDepartmentLink[],
): Promise<void> {
  if (links.length === 0) {
    return;
  }

  // --------------------------------------------------------------------------
  // Load tenant-scoped employees and departments once.
  // --------------------------------------------------------------------------

  const [employees, departments] = await Promise.all([
    tx.employee.findMany({ where: { tenantId } }),
    tx.department.findMany({ where: { tenantId } }),
  ]);

  // --------------------------------------------------------------------------
  // Build lookup maps.
  //
  // JSON references employees/departments by their business codes, while
  // EmployeeDepartment requires the database UUIDs.
  // --------------------------------------------------------------------------

  const employeeByCode = new Map(
    employees.map((employee) => [employee.employeeCode, employee.id]),
  );

  const departmentByCode = new Map(
    departments.map((department) => [department.departmentCode, department.id]),
  );

  // --------------------------------------------------------------------------
  // Resolve and deduplicate relationships.
  // --------------------------------------------------------------------------

  const assignments = new Map<
    string,
    {
      employeeId: string;
      departmentId: string;
    }
  >();

  for (const link of links) {
    const employeeId = employeeByCode.get(link.employee_id);

    if (!employeeId) {
      throw new Error(
        `Seed relationship references unknown employee: ${link.employee_id}`,
      );
    }

    const departmentId = departmentByCode.get(link.department_id);

    if (!departmentId) {
      throw new Error(
        `Seed relationship references unknown department: ${link.department_id}`,
      );
    }

    const key = `${employeeId}:${departmentId}`;

    assignments.set(key, {
      employeeId,
      departmentId,
    });
  }

  if (assignments.size === 0) {
    return;
  }

  // --------------------------------------------------------------------------
  // Insert relationships idempotently.
  //
  // EmployeeDepartment has:
  //
  //   @@id([employeeId, departmentId])
  //
  // Therefore conflictOn uses the actual primary-key fields.
  // --------------------------------------------------------------------------

  for (const assignment of assignments.values()) {
    await tx.employeeDepartment.upsert({
      where: {
        employeeId_departmentId: {
          employeeId: assignment.employeeId,
          departmentId: assignment.departmentId,
        },
      },
      update: {},

      create: {
        employeeId: assignment.employeeId,
        departmentId: assignment.departmentId,
      },
    });
  }
}
