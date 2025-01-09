export interface Employee {
  first_name: string;
  last_name: string;
  date_of_joining: string;
  years_of_experience: number;
  background_info: string;
  departments?: string[];
  _id?: string;
}

export interface Department {
  _id: string;
  name: string;
}

export interface EmployeeDepartment {
  employee_id: string;
  department_id: string;
}
