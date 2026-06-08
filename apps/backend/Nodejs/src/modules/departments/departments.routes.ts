import { Router } from "express";

import {
  getDepartments,
  addDepartment,
  getEmployeesByDepartment,
} from "./departments.controller";

const router = Router();

router.get("/", getDepartments);
router.post("/", addDepartment);
router.get("/:departmentId/employees", getEmployeesByDepartment);

export default router;
