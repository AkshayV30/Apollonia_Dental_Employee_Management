import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-dashboard-hero',
  imports: [],
  templateUrl: './dashboard-hero.html',
  styleUrl: './dashboard-hero.scss',
})
export class DashboardHero {
  readonly employeeCount = input.required<number>();
  readonly departmentCount = input.required<number>();
  readonly patientCount = input.required<number>();

  readonly logoutClicked = output<void>();
}
