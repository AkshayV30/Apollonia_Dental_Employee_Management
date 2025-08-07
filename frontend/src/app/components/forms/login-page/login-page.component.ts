import {
  Component,
  inject,
  ChangeDetectionStrategy,
  signal,
  OnInit,
} from '@angular/core';

import { Router } from '@angular/router';

import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';

@Component({
    selector: 'app-login-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatRadioModule,
        MatCardModule,
        ReactiveFormsModule,
        MatIconModule,
        MatFormFieldModule,
        MatBottomSheetModule,
    ],
    templateUrl: './login-page.component.html',
    styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements OnInit {
  private fb = inject(FormBuilder);

  // Default credentials
  private defaultCredentials = {
    loginId: 'admin123',
    passKey: 'pass123',
  };

  // Reactive form group
  loginCredintials = this.fb.group({
    loginId: [null, Validators.required],
    passKey: [null, Validators.required],
  });

  // --------------
  protected readonly value = signal('');

  protected onInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }

  // ----------

  constructor(private router: Router) {}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  // Signal for toggling password visibility
  hide = signal(true);

  // Handles password visibility toggle
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  //--------------------
  // Handles form submission
  onSubmit(): void {
    const enteredLoginId = this.loginCredintials.get('loginId')?.value ?? '';
    const enteredPassKey = this.loginCredintials.get('passKey')?.value ?? '';

    // Validate credentials
    if (
      enteredLoginId === this.defaultCredentials.loginId &&
      enteredPassKey === this.defaultCredentials.passKey
    ) {
      alert('Welcome to HRMS Admin');
      this.router.navigate(['employees']);
    } else {
      alert('Invalid Login ID or Pass-Key');
    }
  }
}
