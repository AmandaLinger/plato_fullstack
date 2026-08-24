import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Fornecedor, FornecedorCadastro } from '../models/configuracoes.models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FornecedoresService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/api/fornecedores`;

  listarFornecedores(): Observable<readonly Fornecedor[]> {
    return this.http.get<readonly Fornecedor[]>(this.endpoint);
  }

  salvarFornecedor(fornecedor: FornecedorCadastro): Observable<Fornecedor> {
    return this.http.post<Fornecedor>(this.endpoint, fornecedor);
  }

  atualizarFornecedor(id: number, fornecedor: FornecedorCadastro): Observable<void> {
    return this.http.put<void>(`${this.endpoint}/${id}`, fornecedor);
  }

  inativarFornecedor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }

  listar(): Observable<readonly Fornecedor[]> {
    return this.listarFornecedores();
  }
}
