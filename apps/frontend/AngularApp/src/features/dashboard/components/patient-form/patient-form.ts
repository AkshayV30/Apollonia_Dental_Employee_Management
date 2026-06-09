import { Component, output } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CreatePatientPayload } from '../../../../core/models/app.models';

@Component({
  selector: 'app-patient-form',
  imports: [ReactiveFormsModule],
  templateUrl: './patient-form.html',
  styleUrl: './patient-form.scss',
})
export class PatientForm {
  readonly patientCreated = output<CreatePatientPayload>();

  readonly patientForm = new FormGroup({
    patient_name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    patient_image: new FormControl('', {
      nonNullable: true,
    }),
    treatment_notes: new FormControl('', {
      nonNullable: true,
    }),
  });

  submit(): void {
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      return;
    }

    const raw = this.patientForm.getRawValue();

    this.patientCreated.emit({
      patient_name: raw.patient_name,
      patient_image: raw.patient_image || undefined,
      treatment_notes: raw.treatment_notes || undefined,
    });

    this.patientForm.reset({
      patient_name: '',
      patient_image: '',
      treatment_notes: '',
    });
  }
}
