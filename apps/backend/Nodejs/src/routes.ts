import { Router } from "express";

import employeeRoutes from "./modules/employees/employee.routes.js";
import departmentRoutes from "./modules/departments/departments.routes.js";
import assignmentRoutes from "./modules/assignments/assignments.routes.js";
import patientRoutes from "./modules/patients/patient.routes.js";
import authRoutes from "./configs/auth/auth.routes.js";

const router = Router();

router.use("/employees", employeeRoutes);
router.use("/departments", departmentRoutes);
router.use("/assignments", assignmentRoutes);
router.use("/patients", patientRoutes);
router.use("/auth", authRoutes);

export default router;
