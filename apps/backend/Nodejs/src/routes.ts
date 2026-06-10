import { Router } from "express";

import auth from "./middlewares/auth.middleware.js";

import employeeRoutes from "./modules/employees/employee.routes.js";
import departmentRoutes from "./modules/departments/departments.routes.js";
import assignmentRoutes from "./modules/assignments/assignments.routes.js";
import patientRoutes from "./modules/patients/patient.routes.js";
import authRoutes from "./configs/auth/auth.routes.js";

const router = Router();

router.use("/auth", authRoutes);

router.use("/employees", auth, employeeRoutes);
router.use("/departments", auth, departmentRoutes);
router.use("/assignments", auth, assignmentRoutes);
router.use("/patients", auth, patientRoutes);

export default router;
