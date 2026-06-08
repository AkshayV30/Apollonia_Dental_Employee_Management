import { prisma } from "../configs/database/prisma.js";

export async function generateEmployeeCode(tenantId: string) {
  const count = await prisma.employee.count({
    where: {
      tenantId,
    },
  });

  return `EMP${String(count + 1).padStart(3, "0")}`;
}

export async function generateDepartmentCode(tenantId: string) {
  const count = await prisma.department.count({
    where: {
      tenantId,
    },
  });

  return `DEP${String(count + 1).padStart(3, "0")}`;
}

export async function generatePatientCode(tenantId: string) {
  const count = await prisma.patient.count({
    where: {
      tenantId,
    },
  });

  return `PAT${String(count + 1).padStart(3, "0")}`;
}
