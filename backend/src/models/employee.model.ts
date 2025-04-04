import { ObjectId } from "mongodb";

export interface Employee {
  _id?: ObjectId | string;
  first_name: string;
  last_name: string;
  date_of_joining: string;
  years_of_experience: number;
  background_info: string;
  departments?: string[];
}

export interface Department {
  _id: string;
  name: string;
}

export interface EmployeeDepartment {
  employee_id: string;
  department_id: string;
}
