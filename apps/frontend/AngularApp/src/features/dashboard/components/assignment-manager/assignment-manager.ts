import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  Employee,
  Department,
  Assignment,
  CreateAssignmentPayload,
} from '../../../../core/models/app.models';

@Component({
  selector: 'app-assignment-manager',
  imports: [ReactiveFormsModule],
  templateUrl: './assignment-manager.html',
  styleUrl: './assignment-manager.scss',
})
export class AssignmentManager {
  readonly employees = input.required<Employee[]>();
  readonly departments = input.required<Department[]>();
  readonly assignments = input.required<Assignment[]>();

  readonly assignmentCreated = output<CreateAssignmentPayload>();
  readonly assignmentRemoved = output<CreateAssignmentPayload>();

  readonly assignmentForm = new FormGroup({
    employee_id: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    department_id: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  submit(): void {
    if (this.assignmentForm.invalid) {
      this.assignmentForm.markAllAsTouched();
      return;
    }

    this.assignmentCreated.emit(this.assignmentForm.getRawValue());

    this.assignmentForm.reset({
      employee_id: '',
      department_id: '',
    });
  }

  remove(employee_id: string, department_id: string): void {
    this.assignmentRemoved.emit({ employee_id, department_id });
  }
}
