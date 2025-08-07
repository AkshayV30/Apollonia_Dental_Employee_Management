import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { DisplayComponent } from '../forms/display/display.component';

import { LoginPageComponent } from '../forms/login-page/login-page.component';
import { EmployeesListComponent } from '../employees-list/employees-list.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrl: './main.component.scss',
    imports: [
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        AsyncPipe,
        DisplayComponent,
        LoginPageComponent,
        EmployeesListComponent,
        RouterOutlet,
    ]
})
export class MainComponent {
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
}
