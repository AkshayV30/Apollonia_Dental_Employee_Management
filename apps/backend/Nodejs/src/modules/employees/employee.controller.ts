import Employee from "./employee.model";
import { createCRUDController } from "../../utils/crud.controller";

export const { getAll: getEmployees, create: addEmployee } =
  createCRUDController(Employee);
