import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pedido, Produto } from '../models/pedido.models';

interface ItemPedidoPayload {
  readonly produto: Produto;
  readonly quantidade: number;
}

interface PedidoPayload {
  readonly numeroMesa: number;
  readonly itens: readonly ItemPedidoPayload[];
  readonly pedidoAberto: true;
  readonly dataPedido: string;
}

@Injectable({ providedIn: 'root' })
export class PedidosService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/pedido`;

  criar(pedido: Pedido): Observable<void> {
    const payload: PedidoPayload = {
      numeroMesa: Number(pedido.mesa),
      itens: pedido.itens.map((item) => ({
        produto: item.produto,
        quantidade: item.quantidade,
      })),
      pedidoAberto: true,
      dataPedido: this.getLocalDate(),
    };

    return this.http.post<void>(this.endpoint, payload);
  }

  finalizar(ids: readonly number[]): Observable<void> {
    const requests = ids.map((id) =>
      this.http.patch<void>(`${this.endpoint}/${id}/finalizar`, {}),
    );

    return forkJoin(requests).pipe(map(() => undefined));
  }

  private getLocalDate(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
