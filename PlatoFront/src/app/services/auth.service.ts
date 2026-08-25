import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  AtualizarPerfilPayload,
  AuthLoginResponse,
  LoginPayload,
  LoginResponse,
  PerfilUsuario,
  NivelAcesso,
  VerifyTwoFactorPayload,
} from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private readonly tokenKey = 'plato.auth.token';
  private readonly restauranteKey = 'plato.auth.restaurante-id';

  login(payload: LoginPayload): Observable<AuthLoginResponse> {
    return this.http
      .post<AuthLoginResponse>(`${this.apiUrl}/api/auth/login`, payload)
      .pipe(tap((response) => {
        if ('token' in response) {
          this.storeSession(response, payload.restauranteId);
        }
      }));
  }

  verifyTwoFactor(payload: VerifyTwoFactorPayload): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/api/auth/login/verify-2fa`, payload)
      .pipe(tap((response) => this.storeSession(response, 0)));
  }

  buscarPerfil(): Observable<PerfilUsuario> {
    return this.http.get<PerfilUsuario>(`${this.apiUrl}/usuario/perfil`);
  }

  atualizarPerfil(payload: AtualizarPerfilPayload): Observable<PerfilUsuario> {
    return this.http.patch<PerfilUsuario>(`${this.apiUrl}/usuario/perfil`, payload);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRestauranteId(): number | null {
    const value = localStorage.getItem(this.restauranteKey);
    return value === null || !Number.isInteger(Number(value)) ? null : Number(value);
  }

  getNivelAcesso(): NivelAcesso | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const encoded = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(encoded + '='.repeat((4 - encoded.length % 4) % 4))) as { acesso?: NivelAcesso };
      return payload.acesso ?? null;
    } catch {
      return null;
    }
  }

  hasAnyRole(roles: readonly NivelAcesso[]): boolean {
    const acesso = this.getNivelAcesso();
    return acesso !== null && roles.includes(acesso);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        this.clearToken();
        return false;
      }

      const encodedPayload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padding = '='.repeat((4 - (encodedPayload.length % 4)) % 4);
      const payload: unknown = JSON.parse(atob(encodedPayload + padding));
      const expiration =
        typeof payload === 'object' && payload !== null && 'exp' in payload
          ? (payload as { exp?: unknown }).exp
          : null;
      const isValid =
        typeof expiration === 'number' &&
        Number.isFinite(expiration) &&
        expiration > Date.now() / 1000;

      if (!isValid) {
        this.clearToken();
      }
      return isValid;
    } catch {
      this.clearToken();
      return false;
    }
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.restauranteKey);
  }

  private storeSession(response: LoginResponse, restauranteId: number): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.restauranteKey, String(restauranteId));
  }
}
