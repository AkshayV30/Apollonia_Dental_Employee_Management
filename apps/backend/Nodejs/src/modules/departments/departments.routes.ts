import { Router } from "express";
import { getDepartments, addDepartment } from "./departments.controller";

const router = Router();

router.get("/", getDepartments);
router.post("/", addDepartment);

export default router;
