import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Produto, ProdutoPayload } from '../models/pedido.models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProdutosService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/produto`;

  listar(): Observable<readonly Produto[]> {
    return this.http.get<readonly Produto[]>(this.endpoint);
  }

  criar(produto: ProdutoPayload): Observable<Produto> {
    return this.http.post<Produto>(this.endpoint, produto);
  }

  atualizar(id: number, produto: ProdutoPayload): Observable<Produto> {
    return this.http.put<Produto>(`${this.endpoint}/${id}`, produto);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
