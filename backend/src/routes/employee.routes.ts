import { Router } from "express";
import { getEmployees, addEmployee } from "../controllers/employee.controller";

const employeeRoutes = Router();
employeeRoutes.get("/", getEmployees);
employeeRoutes.post("/", addEmployee);

export default employeeRoutes;
