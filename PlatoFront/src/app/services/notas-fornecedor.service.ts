import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { NotaFornecedor, NotaFornecedorCadastro } from '../models/configuracoes.models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotasFornecedorService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/api/notas-fornecedores`;

  listar(): Observable<readonly NotaFornecedor[]> {
    return this.http.get<readonly NotaFornecedor[]>(this.endpoint);
  }

  salvarNota(nota: NotaFornecedorCadastro): Observable<NotaFornecedor> {
    return this.http.post<NotaFornecedor>(this.endpoint, nota);
  }

  criar(nota: NotaFornecedorCadastro): Observable<NotaFornecedor> {
    return this.salvarNota(nota);
  }

  exportarPorPeriodo(inicio: string, fim: string): Observable<Blob> {
    const params = new HttpParams().set('inicio', inicio).set('fim', fim);
    return this.http.get(`${this.endpoint}/relatorio`, {
      params,
      responseType: 'blob',
    });
  }
}
