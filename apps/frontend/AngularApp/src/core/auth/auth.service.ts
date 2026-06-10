import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import { AuthResponse, AuthUser, LoginPayload, SignupPayload } from '../models/app.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly token = signal<string | null>(localStorage.getItem(API_CONFIG.tokenKey));

  private readonly user = signal<AuthUser | null>(this.loadStoredUser());

  readonly isAuthenticated = computed(() => Boolean(this.token()));
  readonly currentUser = computed(() => this.user());

  signup(payload: SignupPayload): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_CONFIG.baseUrl}/auth/signup`, payload)
      .pipe(tap((response) => this.persistAuth(response)));
  }

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_CONFIG.baseUrl}/auth/login`, payload)
      .pipe(tap((response) => this.persistAuth(response)));
  }

  logout(): void {
    localStorage.removeItem(API_CONFIG.tokenKey);
    localStorage.removeItem(API_CONFIG.userKey);

    this.token.set(null);
    this.user.set(null);
  }

  getToken(): string | null {
    return this.token();
  }

  private persistAuth(response: AuthResponse): void {
    localStorage.setItem(API_CONFIG.tokenKey, response.token);
    localStorage.setItem(API_CONFIG.userKey, JSON.stringify(response.user));

    this.token.set(response.token);
    this.user.set(response.user);
  }

  private loadStoredUser(): AuthUser | null {
    const rawUser = localStorage.getItem(API_CONFIG.userKey);

    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser) as AuthUser;
    } catch {
      localStorage.removeItem(API_CONFIG.userKey);
      return null;
    }
  }
}
