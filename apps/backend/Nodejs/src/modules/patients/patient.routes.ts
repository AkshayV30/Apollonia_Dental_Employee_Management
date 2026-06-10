import { Router } from "express";

import { getPatients, addPatient } from "./patient.controller.js";
import { requireRole } from "../../middlewares/role.middleware.js";

const router = Router();

router.get("/", getPatients);
router.post("/", requireRole("ADMIN", "STAFF"), addPatient);

export default router;
