import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import {
  Assignment,
  CreateAssignmentPayload,
  DeleteAssignmentPayload,
  Department,
  CreateDepartmentPayload,
  DepartmentWiseEmployees,
  Employee,
  CreateEmployeePayload,
  Patient,
  CreatePatientPayload,
} from '../models/app.models';

/**
 * ApolloniaApiService
 *
 * This service acts as a single centralized API layer for the Angular frontend.
 *
 * RESPONSIBILITIES:
 * - Communicates with backend REST API (`/api`)
 * - Automatically attaches tenant headers (`x-tenant-id`)
 * - Provides typed methods for all backend resources
 * - Keeps HTTP logic out of components
 *
 * MODULES COVERED:
 * - Departments
 * - Employees
 * - Assignments (mapping employees ↔ departments)
 * - Patients
 *
 * DESIGN GOAL:
 * Components should ONLY call this service instead of HttpClient directly.
 */
@Injectable({
  providedIn: 'root',
})
export class ApolloniaApiService {
  private readonly http = inject(HttpClient);

  /**
   * Base API URL from configuration
   */
  private readonly baseUrl = API_CONFIG.baseUrl;

  /**
   * Default headers attached to every request.
   * Used for multi-tenant support.
   */
  private readonly headers = new HttpHeaders({
    'x-tenant-id': API_CONFIG.tenantId,
  });

  // =========================
  // DEPARTMENTS
  // =========================

  /**
   * GET /departments
   * Fetch all departments
   */
  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.baseUrl}/departments`, {
      headers: this.headers,
    });
  }

  /**
   * POST /departments
   * Create a new department
   */
  createDepartment(payload: CreateDepartmentPayload): Observable<Department> {
    return this.http.post<Department>(`${this.baseUrl}/departments`, payload, {
      headers: this.headers,
    });
  }

  // =========================
  // EMPLOYEES
  // =========================

  /**
   * GET /employees
   * Fetch all employees
   */
  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}/employees`, {
      headers: this.headers,
    });
  }

  /**
   * POST /employees
   * Create a new employee
   */
  createEmployee(payload: CreateEmployeePayload): Observable<Employee> {
    return this.http.post<Employee>(`${this.baseUrl}/employees`, payload, {
      headers: this.headers,
    });
  }

  // =========================
  // ASSIGNMENTS
  // =========================

  /**
   * GET /assignments
   * Fetch all employee-department assignments
   */
  getAssignments(): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.baseUrl}/assignments`, {
      headers: this.headers,
    });
  }

  /**
   * POST /assignments
   * Assign an employee to a department
   */
  createAssignment(payload: CreateAssignmentPayload): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/assignments`, payload, {
      headers: this.headers,
    });
  }

  /**
   * DELETE /assignments
   * Remove an assignment (employee ↔ department link)
   */
  deleteAssignment(payload: DeleteAssignmentPayload): Observable<unknown> {
    return this.http.delete(`${this.baseUrl}/assignments`, {
      headers: this.headers,
      body: payload,
    });
  }

  /**
   * GET /assignments/by-department
   * Returns employees grouped by department
   */
  getDepartmentWiseEmployees(): Observable<DepartmentWiseEmployees[]> {
    return this.http.get<DepartmentWiseEmployees[]>(`${this.baseUrl}/assignments/by-department`, {
      headers: this.headers,
    });
  }

  // =========================
  // PATIENTS
  // =========================

  /**
   * GET /patients
   * Fetch all patients
   */
  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.baseUrl}/patients`, {
      headers: this.headers,
    });
  }

  /**
   * POST /patients
   * Create a new patient record
   */
  createPatient(payload: CreatePatientPayload): Observable<Patient> {
    return this.http.post<Patient>(`${this.baseUrl}/patients`, payload, {
      headers: this.headers,
    });
  }
}
