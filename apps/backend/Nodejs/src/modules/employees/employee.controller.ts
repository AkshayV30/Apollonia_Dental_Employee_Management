import Employee from "./employee.model";
import { createCRUDController } from "../../utils/crud";

export const { getAll: getEmployees, create: addEmployee } =
  createCRUDController(Employee);
