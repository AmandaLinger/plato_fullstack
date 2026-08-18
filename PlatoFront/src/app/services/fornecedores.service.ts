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

  listar(): Observable<readonly Fornecedor[]> {
    return this.listarFornecedores();
  }
}
