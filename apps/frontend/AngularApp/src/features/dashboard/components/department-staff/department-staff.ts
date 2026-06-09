import { Component, input } from '@angular/core';
import { DepartmentWiseEmployees } from '../../../../core/models/app.models';

@Component({
  selector: 'app-department-staff',
  imports: [],
  templateUrl: './department-staff.html',
  styleUrl: './department-staff.scss',
})
export class DepartmentStaff {
  readonly loading = input.required<boolean>();
  readonly departmentWiseEmployees = input.required<DepartmentWiseEmployees[]>();
}
