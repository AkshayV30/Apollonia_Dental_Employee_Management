export interface InitialDepartment {
  department_id: string;
  name: string;
}

export interface InitialEmployee {
  employee_id: string;
  first_name: string;
  last_name: string;
  date_of_joining?: string | null;
  specialization?: string | null;
  years_of_experience?: number | string | null;
  background_info?: string | null;
}

export interface EmployeeDepartmentLink {
  employee_id: string;
  department_id: string;
}

export interface InitialData {
  departments: InitialDepartment[];
  employees: InitialEmployee[];
  employee_departments: EmployeeDepartmentLink[];
}
