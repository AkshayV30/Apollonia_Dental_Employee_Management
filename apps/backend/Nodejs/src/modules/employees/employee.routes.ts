import { Router } from "express";

import {
  getEmployees,
  addEmployee,
  getDepartmentsByEmployee,
} from "./employee.controller.js";

const router = Router();

router.get("/", getEmployees);
router.post("/", addEmployee);
router.get("/:employeeId/departments", getDepartmentsByEmployee);

export default router;
