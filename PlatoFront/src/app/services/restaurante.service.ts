import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SolicitacaoCadastro {
  readonly nomeEstabelecimento: string;
  readonly nomeResponsavel: string;
  readonly telefone: string;
}

export interface Restaurante {
  readonly id: number;
  readonly nome: string;
}

export interface PrimeiroGerentePayload { readonly nome: string; readonly senha: string; }

@Injectable({ providedIn: 'root' })
export class RestauranteService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/api/solicitacoes-cadastro`;

  solicitarLogin(solicitacao: SolicitacaoCadastro): Observable<void> {
    return this.http.post<void>(this.endpoint, solicitacao);
  }

  listarAtivos(): Observable<readonly Restaurante[]> {
    return this.http.get<readonly Restaurante[]>(`${environment.apiUrl}/api/restaurantes`);
  }

  criar(nome: string): Observable<Restaurante> {
    return this.http.post<Restaurante>(`${environment.apiUrl}/api/restaurantes`, { nome });
  }

  inativar(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/api/restaurantes/${id}`);
  }

  criarPrimeiroGerente(id: number, payload: PrimeiroGerentePayload): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/api/restaurantes/${id}/primeiro-gerente`, payload);
  }
}
