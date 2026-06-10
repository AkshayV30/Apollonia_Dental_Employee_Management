import { Router } from "express";

import {
  getEmployees,
  addEmployee,
  getDepartmentsByEmployee,
} from "./employee.controller.js";
import { requireRole } from "../../middlewares/role.middleware.js";

const router = Router();

router.get("/", getEmployees);
router.post("/", requireRole("ADMIN", "STAFF"), addEmployee);
router.get("/:employeeId/departments", getDepartmentsByEmployee);

export default router;
