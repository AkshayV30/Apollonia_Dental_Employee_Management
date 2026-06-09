export interface Department {
  id: string;
  department_id: string;
  name: string;
}

export interface Employee {
  id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  date_of_joining?: string | null;
  specialization?: string | null;
  years_of_experience?: number;
  background_info?: string | null;
  departments?: Department[];
}

export interface Patient {
  id: string;
  patient_id: string;
  patient_name: string;
  patient_image?: string | null;
  treatment_notes?: string | null;
}

export interface Assignment {
  employee_id: string;
  employee_name: string;
  department_id: string;
  department_name: string;
  assigned_at: string;
}

export interface DepartmentWiseEmployees {
  id: string;
  department_id: string;
  name: string;
  employees: Employee[];
}

export interface LoginPayload {
  email?: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
}

export interface CreateDepartmentPayload {
  name: string;
}

export interface CreateEmployeePayload {
  first_name: string;
  last_name: string;
  department_id?: string;
  date_of_joining?: string;
  specialization?: string;
  years_of_experience?: number;
  background_info?: string;
}

export interface CreatePatientPayload {
  patient_name: string;
  patient_image?: string;
  treatment_notes?: string;
}

export interface CreateAssignmentPayload {
  employee_id: string;
  department_id: string;
}

export interface DeleteAssignmentPayload {
  employee_id: string;
  department_id: string;
}
