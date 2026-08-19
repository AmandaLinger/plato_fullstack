import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  AtualizarPerfilPayload,
  LoginPayload,
  LoginResponse,
  PerfilUsuario,
} from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private readonly tokenKey = 'plato.auth.token';

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, payload)
      .pipe(tap((response) => localStorage.setItem(this.tokenKey, response.token)));
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
}
