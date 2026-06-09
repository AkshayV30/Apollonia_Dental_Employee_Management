import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Department, CreateEmployeePayload } from '../../../../core/models/app.models';

@Component({
  selector: 'app-employee-form',
  imports: [ReactiveFormsModule],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.scss',
})
export class EmployeeForm {
  readonly departments = input.required<Department[]>();
  readonly employeeCreated = output<CreateEmployeePayload>();

  readonly employeeForm = new FormGroup({
    first_name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    last_name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    department_id: new FormControl('', {
      nonNullable: true,
    }),
    date_of_joining: new FormControl('', {
      nonNullable: true,
    }),
    specialization: new FormControl('', {
      nonNullable: true,
    }),
    years_of_experience: new FormControl(0, {
      nonNullable: true,
    }),
    background_info: new FormControl('', {
      nonNullable: true,
    }),
  });

  submit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const raw = this.employeeForm.getRawValue();

    this.employeeCreated.emit({
      first_name: raw.first_name,
      last_name: raw.last_name,
      department_id: raw.department_id || undefined,
      date_of_joining: raw.date_of_joining || undefined,
      specialization: raw.specialization || undefined,
      years_of_experience: Number(raw.years_of_experience || 0),
      background_info: raw.background_info || undefined,
    });

    this.employeeForm.reset({
      first_name: '',
      last_name: '',
      department_id: '',
      date_of_joining: '',
      specialization: '',
      years_of_experience: 0,
      background_info: '',
    });
  }
}
