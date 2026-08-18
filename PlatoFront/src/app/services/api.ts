import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario, UsuarioPayload } from '../models/configuracoes.models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Exemplo de requisição GET
  getUsuarios(): Observable<readonly Usuario[]> {
    return this.http.get<readonly Usuario[]>(`${this.apiUrl}/usuario`);
  }

  // Exemplo de requisição POST
  criarUsuario(usuario: UsuarioPayload): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/usuario`, usuario);
  }
}
