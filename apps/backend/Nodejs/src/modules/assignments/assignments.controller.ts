import { Request, Response, NextFunction } from "express";

import { prisma } from "../../configs/database/prisma";
import { getOrCreateTenant } from "../../utils/tenant";

export async function getAssignments(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const tenant = await getOrCreateTenant(req);

    const assignments = await prisma.employeeDepartment.findMany({
      where: {
        employee: {
          tenantId: tenant.id,
        },
      },
      include: {
        employee: true,
        department: true,
      },
      orderBy: {
        assignedAt: "asc",
      },
    });

    res.json(
      assignments.map((item) => ({
        employee_id: item.employee.employeeCode,
        employee_name: `${item.employee.firstName} ${item.employee.lastName}`,
        department_id: item.department.departmentCode,
        department_name: item.department.name,
        assigned_at: item.assignedAt,
      })),
    );
  } catch (err) {
    next(err);
  }
}

export async function createAssignment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const tenant = await getOrCreateTenant(req);
    const { employee_id, department_id } = req.body;

    if (!employee_id || !department_id) {
      return res.status(400).json({
        error: "employee_id and department_id are required",
      });
    }

    const employee = await prisma.employee.findFirst({
      where: {
        tenantId: tenant.id,
        employeeCode: employee_id,
      },
    });

    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
        employee_id,
      });
    }

    const department = await prisma.department.findFirst({
      where: {
        tenantId: tenant.id,
        departmentCode: department_id,
      },
    });

    if (!department) {
      return res.status(404).json({
        error: "Department not found",
        department_id,
      });
    }

    const assignment = await prisma.employeeDepartment.upsert({
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

    res.status(201).json(assignment);
  } catch (err) {
    next(err);
  }
}

export async function deleteAssignment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const tenant = await getOrCreateTenant(req);
    const { employee_id, department_id } = req.body;

    if (!employee_id || !department_id) {
      return res.status(400).json({
        error: "employee_id and department_id are required",
      });
    }

    const employee = await prisma.employee.findFirst({
      where: {
        tenantId: tenant.id,
        employeeCode: employee_id,
      },
    });

    const department = await prisma.department.findFirst({
      where: {
        tenantId: tenant.id,
        departmentCode: department_id,
      },
    });

    if (!employee || !department) {
      return res.status(404).json({
        error: "Employee or department not found",
      });
    }

    await prisma.employeeDepartment.delete({
      where: {
        employeeId_departmentId: {
          employeeId: employee.id,
          departmentId: department.id,
        },
      },
    });

    res.json({
      message: "Assignment removed",
      employee_id,
      department_id,
    });
  } catch (err) {
    next(err);
  }
}

export async function getDepartmentWiseEmployees(
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
      include: {
        employees: {
          include: {
            employee: true,
          },
          orderBy: {
            employee: {
              firstName: "asc",
            },
          },
        },
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
        employees: department.employees.map((item) => ({
          id: item.employee.id,
          employee_id: item.employee.employeeCode,
          first_name: item.employee.firstName,
          last_name: item.employee.lastName,
          specialization: item.employee.specialization,
          years_of_experience: item.employee.yearsOfExperience,
          background_info: item.employee.backgroundInfo,
        })),
      })),
    );
  } catch (err) {
    next(err);
  }
}
