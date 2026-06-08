import { Request, Response, NextFunction } from "express";

import { prisma } from "../../configs/database/prisma.js";
import { getOrCreateTenant } from "../../utils/tenant.js";
import { generateEmployeeCode } from "../../utils/codes.js";

export async function getEmployees(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const tenant = await getOrCreateTenant(req);

    const employees = await prisma.employee.findMany({
      where: {
        tenantId: tenant.id,
      },
      include: {
        departments: {
          include: {
            department: true,
          },
        },
      },
      orderBy: {
        employeeCode: "asc",
      },
    });

    const result = employees.map((employee) => ({
      id: employee.id,
      employee_id: employee.employeeCode,
      first_name: employee.firstName,
      last_name: employee.lastName,
      date_of_joining: employee.dateOfJoining,
      specialization: employee.specialization,
      years_of_experience: employee.yearsOfExperience,
      background_info: employee.backgroundInfo,
      departments: employee.departments.map((item) => ({
        id: item.department.id,
        department_id: item.department.departmentCode,
        name: item.department.name,
      })),
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function addEmployee(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const tenant = await getOrCreateTenant(req);

    const { first_name, last_name } = req.body;

    if (!first_name || !last_name) {
      return res.status(400).json({
        error: "first_name and last_name are required",
      });
    }

    const employeeCode =
      req.body.employee_id || (await generateEmployeeCode(tenant.id));

    const employee = await prisma.employee.create({
      data: {
        tenantId: tenant.id,
        employeeCode,
        firstName: first_name,
        lastName: last_name,
        dateOfJoining: req.body.date_of_joining
          ? new Date(req.body.date_of_joining)
          : null,
        specialization: req.body.specialization || null,
        yearsOfExperience: Number(req.body.years_of_experience ?? 0),
        backgroundInfo: req.body.background_info || null,
      },
    });

    if (req.body.department_id) {
      const department = await prisma.department.findFirst({
        where: {
          tenantId: tenant.id,
          departmentCode: req.body.department_id,
        },
      });

      if (!department) {
        return res.status(404).json({
          error: "Department not found",
          department_id: req.body.department_id,
        });
      }

      await prisma.employeeDepartment.create({
        data: {
          employeeId: employee.id,
          departmentId: department.id,
        },
      });
    }

    res.status(201).json({
      id: employee.id,
      employee_id: employee.employeeCode,
      first_name: employee.firstName,
      last_name: employee.lastName,
      date_of_joining: employee.dateOfJoining,
      specialization: employee.specialization,
      years_of_experience: employee.yearsOfExperience,
      background_info: employee.backgroundInfo,
    });
  } catch (err) {
    next(err);
  }
}

export async function getDepartmentsByEmployee(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const tenant = await getOrCreateTenant(req);
    const { employeeId } = req.params;

    const employee = await prisma.employee.findFirst({
      where: {
        tenantId: tenant.id,
        employeeCode: employeeId,
      },
      include: {
        departments: {
          include: {
            department: true,
          },
        },
      },
    });

    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }

    res.json(
      employee.departments.map((item) => ({
        id: item.department.id,
        department_id: item.department.departmentCode,
        name: item.department.name,
      })),
    );
  } catch (err) {
    next(err);
  }
}
