import fs from "node:fs/promises";

import { INITIAL_DATA_PATH } from "../seed.config.js";
import type {
  EmployeeDepartmentLink,
  InitialData,
  InitialDepartment,
  InitialEmployee,
} from "../seed.types.js";

import {
  isRecord,
  optionalString,
  requiredString,
  parseExperience,
} from "./parsers/seed-values.js";

// ============================================================================
// INITIAL DATA LOADER
// ============================================================================

export async function loadInitialData(): Promise<InitialData> {
  const raw = await fs.readFile(INITIAL_DATA_PATH, "utf8");

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(`Unable to parse seed data: ${INITIAL_DATA_PATH}`, {
      cause: error,
    });
  }

  return parseInitialData(parsed);
}

// ============================================================================
// DATA STRUCTURE VALIDATION
// ============================================================================

function parseInitialData(value: unknown): InitialData {
  if (!isRecord(value)) {
    throw new Error("Invalid seed data: root must be an object");
  }

  if (!Array.isArray(value.departments)) {
    throw new Error("Invalid seed data: departments must be an array");
  }

  if (!Array.isArray(value.employees)) {
    throw new Error("Invalid seed data: employees must be an array");
  }

  if (!Array.isArray(value.employee_departments)) {
    throw new Error("Invalid seed data: employee_departments must be an array");
  }

  return {
    departments: value.departments.map(parseDepartment),
    employees: value.employees.map(parseEmployee),
    employee_departments: value.employee_departments.map(
      parseEmployeeDepartmentLink,
    ),
  };
}

// ============================================================================
// DEPARTMENT
// ============================================================================

function parseDepartment(value: unknown): InitialDepartment {
  if (!isRecord(value)) {
    throw new Error("Invalid department entry");
  }

  return {
    department_id: requiredString(value.department_id, "department_id"),

    name: requiredString(value.name, "name"),
  };
}

// ============================================================================
// EMPLOYEE
// ============================================================================

function parseEmployee(value: unknown): InitialEmployee {
  if (!isRecord(value)) {
    throw new Error("Invalid employee entry");
  }

  return {
    employee_id: requiredString(value.employee_id, "employee_id"),

    first_name: requiredString(value.first_name, "first_name"),

    last_name: requiredString(value.last_name, "last_name"),

    date_of_joining: optionalString(value.date_of_joining, "date_of_joining"),

    specialization: optionalString(value.specialization, "specialization"),

    years_of_experience: parseExperience(value.years_of_experience),

    background_info: optionalString(value.background_info, "background_info"),
  };
}

// ============================================================================
// EMPLOYEE <-> DEPARTMENT
// ============================================================================

function parseEmployeeDepartmentLink(value: unknown): EmployeeDepartmentLink {
  if (!isRecord(value)) {
    throw new Error("Invalid employee_departments entry");
  }

  return {
    employee_id: requiredString(value.employee_id, "employee_id"),

    department_id: requiredString(value.department_id, "department_id"),
  };
}
