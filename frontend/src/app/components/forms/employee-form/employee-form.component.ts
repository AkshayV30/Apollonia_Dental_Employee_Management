import { Component, effect, EventEmitter, input, Output } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Employee } from '../../../interfaces/employee';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-employee-form',
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatButtonModule,
    ],
    templateUrl: './employee-form.component.html',
    styleUrl: './employee-form.component.scss'
})
export class EmployeeFormComponent {
  initialState = input<Employee>();

  @Output()
  formValuesChanged = new EventEmitter<Employee>();

  @Output()
  formSubmitted = new EventEmitter<Employee>();
  employeeForm: any;
  first_name: any;

  // employeeForm = this.formBuilder.group({
  //   first_name: ['', [Validators.required, Validators.minLength(3)]],
  //   position: ['', [Validators.required, Validators.minLength(5)]],
  //   level: ['junior', [Validators.required]],
  // });

  constructor(private formBuilder: FormBuilder) {
    effect(() => {
      this.employeeForm.setValue({
        first_name: this.initialState()?.first_name || '',
      });
    });
  }

  get name() {
    return this.employeeForm.get('first_name')!;
  }
  // get position() {
  //   return this.employeeForm.get('pos')!;
  // }
  // get level() {
  //   return this.employeeForm.get('level')!;
  // }

  submitForm() {
    this.formSubmitted.emit(this.employeeForm.value as Employee);
    console.log(this.employeeForm.value);
  }
}
