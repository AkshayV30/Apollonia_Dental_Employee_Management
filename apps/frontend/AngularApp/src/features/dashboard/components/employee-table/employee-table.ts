import { Component, input } from '@angular/core';
import { Employee } from '../../../../core/models/app.models';

@Component({
  selector: 'app-employee-table',
  imports: [],
  templateUrl: './employee-table.html',
  styleUrl: './employee-table.scss',
})
export class EmployeeTable {
  readonly employees = input.required<Employee[]>();
}
