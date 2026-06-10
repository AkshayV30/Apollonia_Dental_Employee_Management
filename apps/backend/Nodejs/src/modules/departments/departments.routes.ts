import { Router } from "express";

import {
  getDepartments,
  addDepartment,
  getEmployeesByDepartment,
} from "./departments.controller.js";
import { requireRole } from "../../middlewares/role.middleware.js";

const router = Router();

router.get("/", getDepartments);
router.post("/", requireRole("ADMIN", "STAFF"), addDepartment);
router.get("/:departmentId/employees", getEmployeesByDepartment);

export default router;
