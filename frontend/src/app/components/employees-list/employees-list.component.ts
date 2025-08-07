import {
  AfterViewInit,
  Component,
  WritableSignal,
  ViewChild,
  OnInit,
} from '@angular/core';
import { RouterModule } from '@angular/router';

import { Employee } from '../../interfaces/employee';
import { EmployeeService } from '../../services/employee.service';

import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import {
  DisplayDataSource,
  DisplayItem,
} from '../forms/display/display-datasource';

@Component({
    selector: 'app-employees-list',
    imports: [
        RouterModule,
        MatTableModule,
        MatButtonModule,
        MatCardModule,
        MatSortModule,
        MatPaginatorModule,
    ],
    templateUrl: './employees-list.component.html',
    styleUrl: './employees-list.component.scss'
})
export class EmployeesListComponent implements OnInit {
  // employees$ = {} as WritableSignal<Employee[]>;
  // employees: Employee[] = [];

  dataSource!: MatTableDataSource<Employee>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // @ViewChild(MatTable) table!: MatTable<DisplayItem>;

  displayedColumns = [
    'col-first-name',
    'col-last-name',
    'col-date-of-joining',
    'col-years-of-experience',
    'col-background-info',
    'col-departments',
    'col-action',
  ];

  constructor(private employeesService: EmployeeService) {}

  ngOnInit() {
    this.employeesService.getEmployees().subscribe((employees) => {
      this.dataSource = new MatTableDataSource<Employee>(employees);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  deleteEmployee(id: string): void {
    this.employeesService.deleteEmployee(id).subscribe({
      next: () => {
        this.employeesService.getEmployees().subscribe((employees) => {
          this.dataSource.data = employees;
        });
      },
    });
  }
}
