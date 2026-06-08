import fs from "fs";
import path from "path";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { CONFIG } from "../src/configs/env.js";

const adapter = new PrismaPg({
  connectionString: CONFIG.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const TENANT_SLUG = "apollonia";

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: {
      slug: TENANT_SLUG,
    },
    update: {
      name: "Apollonia Dental Practice",
    },
    create: {
      name: "Apollonia Dental Practice",
      slug: TENANT_SLUG,
    },
  });

  const dataPath = path.join(process.cwd(), "src", "seed", "initialData.json");
  const rawData = fs.readFileSync(dataPath, "utf-8");

  const { departments, employees, employee_departments } = JSON.parse(rawData);

  for (const department of departments) {
    await prisma.department.upsert({
      where: {
        tenantId_departmentCode: {
          tenantId: tenant.id,
          departmentCode: department.department_id,
        },
      },
      update: {
        name: department.name,
      },
      create: {
        tenantId: tenant.id,
        departmentCode: department.department_id,
        name: department.name,
      },
    });
  }

  for (const employee of employees) {
    await prisma.employee.upsert({
      where: {
        tenantId_employeeCode: {
          tenantId: tenant.id,
          employeeCode: employee.employee_id,
        },
      },
      update: {
        firstName: employee.first_name,
        lastName: employee.last_name,
        dateOfJoining: employee.date_of_joining
          ? new Date(employee.date_of_joining)
          : null,
        specialization: employee.specialization ?? null,
        yearsOfExperience: Number(employee.years_of_experience ?? 0),
        backgroundInfo: employee.background_info ?? null,
      },
      create: {
        tenantId: tenant.id,
        employeeCode: employee.employee_id,
        firstName: employee.first_name,
        lastName: employee.last_name,
        dateOfJoining: employee.date_of_joining
          ? new Date(employee.date_of_joining)
          : null,
        specialization: employee.specialization ?? null,
        yearsOfExperience: Number(employee.years_of_experience ?? 0),
        backgroundInfo: employee.background_info ?? null,
      },
    });
  }

  for (const link of employee_departments) {
    const employee = await prisma.employee.findUnique({
      where: {
        tenantId_employeeCode: {
          tenantId: tenant.id,
          employeeCode: link.employee_id,
        },
      },
    });

    const department = await prisma.department.findUnique({
      where: {
        tenantId_departmentCode: {
          tenantId: tenant.id,
          departmentCode: link.department_id,
        },
      },
    });

    if (!employee || !department) {
      continue;
    }

    await prisma.employeeDepartment.upsert({
      where: {
        employeeId_departmentId: {
          employeeId: employee.id,
          departmentId: department.id,
        },
      },
      update: {},
      create: {
        employeeId: employee.id,
        departmentId: department.id,
      },
    });
  }

  console.log("✅ Apollonia PostgreSQL seed completed");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
