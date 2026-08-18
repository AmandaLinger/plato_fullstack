import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { PedidoRegistrado } from '../models/pedido.models';

export interface ProdutoNotaFiscal {
  readonly nome: string;
  readonly quantidade: number;
}

export interface NotaFiscal {
  readonly id: string;
  readonly numero: string;
  readonly emitidaEm: string;
  readonly valorTotal: number;
  readonly produtos: readonly ProdutoNotaFiscal[];
}

@Injectable({ providedIn: 'root' })
export class NotasFiscaisService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/pedido`;

  listarPorData(data: string): Observable<readonly NotaFiscal[]> {
    const params = new HttpParams().set('data', data);

    return this.http
      .get<readonly PedidoRegistrado[]>(`${this.endpoint}/finalizados`, { params })
      .pipe(
        map((pedidos) =>
          pedidos.map((pedido) => ({
            id: String(pedido.id),
            numero: String(pedido.id).padStart(6, '0'),
            emitidaEm: pedido.dataPedido,
            valorTotal: pedido.itens.reduce(
              (total, item) => total + item.produto.preco * item.quantidade,
              0,
            ),
            produtos: pedido.itens.map((item) => ({
              nome: item.produto.nome,
              quantidade: item.quantidade,
            })),
          })),
        ),
      );
  }
}
