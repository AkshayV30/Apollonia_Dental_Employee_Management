import { Component, input } from '@angular/core';
import { Patient } from '../../../../core/models/app.models';

@Component({
  selector: 'app-patient-table',
  imports: [],
  templateUrl: './patient-table.html',
  styleUrl: './patient-table.scss',
})
export class PatientTable {
  readonly patients = input.required<Patient[]>();
}
