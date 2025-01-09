import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee, EmployeeDepartment } from '../interfaces/employee';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  //
  //
  // ---------------
  // need to update
  // ---------------
  //
  //
  private url = 'http://localhost:5200';

  employees$ = signal<Employee[]>([]);
  employee$ = signal<Employee>({} as Employee);

  constructor(private httpClient: HttpClient) {}

  getEmployees() {
    this.httpClient
      .get<Employee[]>(`${this.url}/v1/`)
      .subscribe((employees) => {
        this.employees$.set(employees);
      });
  }

  getEmployee(id: string) {
    this.httpClient
      .get<Employee>(`${this.url}/v1/:${id}`)
      .subscribe((employee) => {
        this.employee$.set(employee);
        return this.employee$();
      });
  }

  createEmployee(employee: Employee) {
    return this.httpClient.post(`${this.url}/v1/`, employee, {
      responseType: 'text',
    });
  }

  updateEmployee(id: string, employee: Employee) {
    return this.httpClient.put(`${this.url}/v1/:${id}`, employee, {
      responseType: 'text',
    });
  }

  deleteEmployee(id: string) {
    return this.httpClient.delete(`${this.url}/v1/:${id}`, {
      responseType: 'text',
    });
  }

  addEmployeeByDepartment(id: string, departmentId: EmployeeDepartment) {
    return this.httpClient.post(
      `${this.url}/v1/:${id}/departments`,
      departmentId,
      {
        responseType: 'text',
      }
    );
  }

  //
  // need to be updated
  //
  /** Get all departments of an employee */
  getAllDepartmentsEmployee(id: string): Observable<Employee> {
    this.httpClient;
    return this.httpClient.get<Employee>(`${this.url}/v1/:${id}/departments`);
  }
}
