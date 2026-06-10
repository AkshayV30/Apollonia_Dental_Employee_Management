import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';

import { AuthService } from '../../core/auth/auth.service';
import { ApolloniaApiService } from '../../core/api/app-api.service';

import {
  Assignment,
  Department,
  DepartmentWiseEmployees,
  Employee,
  Patient,
} from '../../core/models/app.models';

import { AssignmentManager } from './components/assignment-manager/assignment-manager';
import { DashboardHero } from './components/dashboard-hero/dashboard-hero';
import { DepartmentForm } from './components/department-form/department-form';
import { DepartmentStaff } from './components/department-staff/department-staff';
import { EmployeeForm } from './components/employee-form/employee-form';
import { EmployeeTable } from './components/employee-table/employee-table';
import { PatientForm } from './components/patient-form/patient-form';
import { PatientTable } from './components/patient-table/patient-table';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    AssignmentManager,
    DashboardHero,
    DepartmentForm,
    DepartmentStaff,
    EmployeeForm,
    EmployeeTable,
    PatientForm,
    PatientTable,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly api = inject(ApolloniaApiService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly currentUser = this.auth.currentUser;

  readonly loading = signal(false);
  readonly error = signal('');

  readonly departments = signal<Department[]>([]);
  readonly employees = signal<Employee[]>([]);
  readonly patients = signal<Patient[]>([]);
  readonly assignments = signal<Assignment[]>([]);
  readonly departmentWiseEmployees = signal<DepartmentWiseEmployees[]>([]);

  readonly employeeCount = computed(() => this.employees().length);
  readonly departmentCount = computed(() => this.departments().length);
  readonly patientCount = computed(() => this.patients().length);

  ngOnInit(): void {
    this.loadDashboard();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  loadDashboard(): void {
    this.loading.set(true);
    this.error.set('');

    this.api.getDepartments().subscribe({
      next: (departments) => this.departments.set(departments),
      error: () => this.error.set('Failed to load departments'),
    });

    this.api.getEmployees().subscribe({
      next: (employees) => this.employees.set(employees),
      error: () => this.error.set('Failed to load employees'),
    });

    this.api.getPatients().subscribe({
      next: (patients) => this.patients.set(patients),
      error: () => this.error.set('Failed to load patients'),
    });

    this.api.getAssignments().subscribe({
      next: (assignments) => this.assignments.set(assignments),
      error: () => this.error.set('Failed to load assignments'),
    });

    this.api.getDepartmentWiseEmployees().subscribe({
      next: (groups) => {
        this.departmentWiseEmployees.set(groups);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load department-wise employees');
        this.loading.set(false);
      },
    });
  }

  createDepartment(name: string): void {
    this.error.set('');

    this.api.createDepartment({ name }).subscribe({
      next: () => this.loadDashboard(),
      error: (err) => this.error.set(err?.error?.error || 'Failed to create department'),
    });
  }

  createEmployee(payload: any): void {
    this.error.set('');

    this.api.createEmployee(payload).subscribe({
      next: () => this.loadDashboard(),
      error: (err) => this.error.set(err?.error?.error || 'Failed to create employee'),
    });
  }

  createPatient(payload: any): void {
    this.error.set('');

    this.api.createPatient(payload).subscribe({
      next: () => this.loadDashboard(),
      error: (err) => this.error.set(err?.error?.error || 'Failed to create patient'),
    });
  }

  createAssignment(payload: { employee_id: string; department_id: string }): void {
    this.error.set('');

    this.api.createAssignment(payload).subscribe({
      next: () => this.loadDashboard(),
      error: (err) => this.error.set(err?.error?.error || 'Failed to assign employee'),
    });
  }

  removeAssignment(payload: { employee_id: string; department_id: string }): void {
    this.error.set('');

    this.api.deleteAssignment(payload).subscribe({
      next: () => this.loadDashboard(),
      error: (err) => this.error.set(err?.error?.error || 'Failed to remove assignment'),
    });
  }
}
