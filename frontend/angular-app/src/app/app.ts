import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Employee } from './components/employees/employee/employee';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Employee],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('angular-app');
}
