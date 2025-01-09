import { Routes } from '@angular/router';

import { EmployeesListComponent } from './components/employees-list/employees-list.component';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { EditEmployeeComponent } from './components/edit-employee/edit-employee.component';
import { LoginPageComponent } from './components/forms/login-page/login-page.component';

export const routes: Routes = [
  { path: '', component: LoginPageComponent },
  {
    path: 'employees',
    component: EmployeesListComponent,
    title: 'Employees List',
  },
  { path: 'new', component: AddEmployeeComponent },
  { path: 'edit/:id', component: EditEmployeeComponent },
];
