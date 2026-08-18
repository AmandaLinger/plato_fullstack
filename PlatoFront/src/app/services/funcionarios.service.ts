import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Funcionario, FuncionarioCadastro } from '../models/configuracoes.models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FuncionariosService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/funcionario`;

  listarAtivos(): Observable<readonly Funcionario[]> {
    return this.http.get<readonly Funcionario[]>(this.endpoint);
  }

  criar(funcionario: FuncionarioCadastro): Observable<Funcionario> {
    return this.http.post<Funcionario>(this.endpoint, funcionario);
  }
}
