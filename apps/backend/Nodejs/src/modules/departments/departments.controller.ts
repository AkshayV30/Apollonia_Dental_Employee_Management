import Department from "./departments.model";
import { createCRUDController } from "../../utils/crud.controller";

export const { getAll: getDepartments, create: addDepartment } =
  createCRUDController(Department);
