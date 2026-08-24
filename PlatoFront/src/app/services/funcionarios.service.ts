import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Funcionario, FuncionarioAtualizacao, FuncionarioCadastro, FuncionarioCriado } from '../models/configuracoes.models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FuncionariosService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/funcionario`;

  listarAtivos(): Observable<readonly Funcionario[]> {
    return this.http.get<readonly Funcionario[]>(this.endpoint);
  }

  criar(funcionario: FuncionarioCadastro): Observable<FuncionarioCriado> {
    return this.http.post<FuncionarioCriado>(this.endpoint, funcionario);
  }

  atualizar(id: number, funcionario: FuncionarioAtualizacao): Observable<void> {
    return this.http.put<void>(`${this.endpoint}/${id}`, funcionario);
  }

  inativar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
