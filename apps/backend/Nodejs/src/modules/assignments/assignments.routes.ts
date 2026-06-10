import { Router } from "express";

import {
  getAssignments,
  createAssignment,
  deleteAssignment,
  getDepartmentWiseEmployees,
} from "./assignments.controller.js";
import { requireRole } from "../../middlewares/role.middleware.js";

const router = Router();

router.get("/", getAssignments);
router.get("/by-department", getDepartmentWiseEmployees);

router.post("/", requireRole("ADMIN", "STAFF"), createAssignment);
router.delete("/", requireRole("ADMIN"), deleteAssignment);

export default router;
