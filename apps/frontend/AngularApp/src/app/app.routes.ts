import { Routes } from '@angular/router';

import { authGuard } from '../core/auth/auth.gaurd';
import { Login } from '../features/auth/login/login';

import { Dashboard } from '../features/dashboard/dashboard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: '',
    component: Dashboard,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
