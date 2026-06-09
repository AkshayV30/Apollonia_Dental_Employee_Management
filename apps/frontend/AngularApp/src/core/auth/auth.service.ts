import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import { LoginPayload, LoginResponse } from '../models/app.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly token = signal<string | null>(localStorage.getItem(API_CONFIG.tokenKey));

  readonly isAuthenticated = computed(() => Boolean(this.token()));

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_CONFIG.baseUrl}/auth/login`, payload).pipe(
      tap((response) => {
        localStorage.setItem(API_CONFIG.tokenKey, response.token);
        this.token.set(response.token);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(API_CONFIG.tokenKey);
    this.token.set(null);
  }

  getToken(): string | null {
    return this.token();
  }
}
