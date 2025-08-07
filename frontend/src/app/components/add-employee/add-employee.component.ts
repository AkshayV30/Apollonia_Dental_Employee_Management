import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

import { Employee } from '../../interfaces/employee';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeFormComponent } from '../forms/employee-form/employee-form.component';

@Component({
    selector: 'app-add-employee',
    imports: [EmployeeFormComponent, MatCardModule],
    templateUrl: './add-employee.component.html',
    styleUrl: './add-employee.component.scss'
})
export class AddEmployeeComponent {
  constructor(
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  addEmployee(employee: Employee) {
    this.employeeService.createEmployee(employee).subscribe({
      next: () => {
        this.router.navigate(['/v1/']);
      },
      error: (error) => {
        alert('Failed to create employee');
        console.error(error);
      },
    });
    this.employeeService.getEmployees();
  }
}
