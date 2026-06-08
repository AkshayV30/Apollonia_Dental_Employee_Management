import { Request, Response, NextFunction } from "express";

import { prisma } from "../../configs/database/prisma.js";
import { getOrCreateTenant } from "../../utils/tenant.js";
import { generateDepartmentCode } from "../../utils/codes.js";

export async function getDepartments(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const tenant = await getOrCreateTenant(req);

    const departments = await prisma.department.findMany({
      where: {
        tenantId: tenant.id,
      },
      orderBy: {
        departmentCode: "asc",
      },
    });

    res.json(
      departments.map((department) => ({
        id: department.id,
        department_id: department.departmentCode,
        name: department.name,
      })),
    );
  } catch (err) {
    next(err);
  }
}

export async function addDepartment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const tenant = await getOrCreateTenant(req);

    if (!req.body.name) {
      return res.status(400).json({
        error: "Department name is required",
      });
    }

    const departmentCode =
      req.body.department_id || (await generateDepartmentCode(tenant.id));

    const department = await prisma.department.create({
      data: {
        tenantId: tenant.id,
        departmentCode,
        name: req.body.name,
      },
    });

    res.status(201).json({
      id: department.id,
      department_id: department.departmentCode,
      name: department.name,
    });
  } catch (err) {
    next(err);
  }
}

export async function getEmployeesByDepartment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const tenant = await getOrCreateTenant(req);
    const { departmentId } = req.params;

    const department = await prisma.department.findFirst({
      where: {
        tenantId: tenant.id,
        departmentCode: departmentId,
      },
      include: {
        employees: {
          include: {
            employee: true,
          },
        },
      },
    });

    if (!department) {
      return res.status(404).json({
        error: "Department not found",
      });
    }

    res.json(
      department.employees.map((item) => ({
        id: item.employee.id,
        employee_id: item.employee.employeeCode,
        first_name: item.employee.firstName,
        last_name: item.employee.lastName,
        specialization: item.employee.specialization,
        years_of_experience: item.employee.yearsOfExperience,
        background_info: item.employee.backgroundInfo,
      })),
    );
  } catch (err) {
    next(err);
  }
}
