import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';

type AuthMode = 'login' | 'signup';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly mode = signal<AuthMode>('login');
  readonly loading = signal(false);
  readonly error = signal('');

  readonly title = computed(() => (this.mode() === 'login' ? 'Sign in' : 'Create account'));

  readonly subtitle = computed(() =>
    this.mode() === 'login'
      ? 'Use your Apollonia account to access the clinic dashboard.'
      : 'Create the first admin or a new staff user for this tenant.',
  );

  readonly loginForm = new FormGroup({
    email: new FormControl('admin@apollonia.local', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('password123', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  readonly signupForm = new FormGroup({
    name: new FormControl('Admin User', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('admin@apollonia.local', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('password123', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
  });

  switchMode(nextMode: AuthMode): void {
    this.mode.set(nextMode);
    this.error.set('');
  }

  submit(): void {
    if (this.mode() === 'login') {
      this.login();
      return;
    }

    this.signup();
  }

  private login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.auth.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.error || 'Login failed');
      },
    });
  }

  private signup(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.auth.signup(this.signupForm.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.error || 'Signup failed');
      },
    });
  }
}
