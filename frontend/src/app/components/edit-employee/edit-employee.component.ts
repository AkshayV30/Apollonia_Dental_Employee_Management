import { Component, OnInit, WritableSignal } from '@angular/core';
import { EmployeeFormComponent } from '../forms/employee-form/employee-form.component';
import { MatCardModule } from '@angular/material/card';
import { Employee } from '../../interfaces/employee';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [EmployeeFormComponent, MatCardModule],
  templateUrl: './edit-employee.component.html',
  styleUrl: './edit-employee.component.scss',
})
export class EditEmployeeComponent implements OnInit {
  employee = {} as WritableSignal<Employee>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      alert('No id provided');
    }

    this.employeeService.getEmployee(id!);
    this.employee = this.employeeService.employee$;
  }

  editEmployee(employee: Employee) {
    this.employeeService
      .updateEmployee(this.employee()._id || '', employee)
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          alert('Failed to update employee');
          console.error(error);
        },
      });
  }
}
