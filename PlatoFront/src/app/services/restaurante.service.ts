import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SolicitacaoCadastro {
  readonly id: number;
  readonly nomeEstabelecimento: string;
  readonly nomeResponsavel: string;
  readonly telefone: string;
  readonly status: 'PENDENTE' | 'APROVADO' | 'REJEITADO';
  readonly dataCriacao: string;
}

export type NovaSolicitacaoCadastro = Pick<SolicitacaoCadastro, 'nomeEstabelecimento' | 'nomeResponsavel' | 'telefone'>;

export interface Restaurante {
  readonly id: number;
  readonly nome: string;
}

export interface PrimeiroGerentePayload { readonly nome: string; readonly senha: string; }

@Injectable({ providedIn: 'root' })
export class RestauranteService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/api/solicitacoes-cadastro`;

  solicitarLogin(solicitacao: NovaSolicitacaoCadastro): Observable<void> {
    return this.http.post<void>(this.endpoint, solicitacao);
  }

  listarSolicitacoesPendentes(): Observable<readonly SolicitacaoCadastro[]> {
    return this.http.get<readonly SolicitacaoCadastro[]>(this.endpoint);
  }

  rejeitarSolicitacao(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }

  aprovarSolicitacao(id: number): Observable<Restaurante> {
    return this.http.patch<Restaurante>(`${this.endpoint}/${id}/aprovar`, {});
  }

  listarAtivos(): Observable<readonly Restaurante[]> {
    return this.http.get<readonly Restaurante[]>(`${environment.apiUrl}/api/restaurantes`);
  }

  listarAtivosSemGerente(): Observable<readonly Restaurante[]> {
    return this.http.get<readonly Restaurante[]>(`${environment.apiUrl}/api/restaurantes/sem-gerente`);
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
