import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ProdutoCardapioPublico {
  readonly id: number;
  readonly nome: string;
  readonly descricao: string | null;
  readonly preco: number;
  readonly imagemUrl: string | null;
  readonly categoria: string;
}

export interface CardapioPublico {
  readonly restauranteId: number;
  readonly restauranteNome: string;
  readonly produtos: readonly ProdutoCardapioPublico[];
}

@Injectable({ providedIn: 'root' })
export class CardapioPublicoService {
  private readonly http = inject(HttpClient);

  buscar(restauranteId: number): Observable<CardapioPublico> {
    return this.http.get<CardapioPublico>(
      `${environment.apiUrl}/api/public/restaurantes/${restauranteId}/cardapio`,
    );
  }
}
