import { Router } from "express";

import {
  getAssignments,
  createAssignment,
  deleteAssignment,
  getDepartmentWiseEmployees,
} from "./assignments.controller";

const router = Router();

router.get("/", getAssignments);
router.post("/", createAssignment);
router.delete("/", deleteAssignment);
router.get("/by-department", getDepartmentWiseEmployees);

export default router;
