import Patient from "./patient.model";
import { createCRUDController } from "../../utils/crud";

export const { getAll: getPatients, create: addPatient } =
  createCRUDController(Patient);
