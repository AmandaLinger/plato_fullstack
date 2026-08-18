import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SolicitacaoCadastro {
  readonly nomeEstabelecimento: string;
  readonly nomeResponsavel: string;
  readonly telefone: string;
}

@Injectable({ providedIn: 'root' })
export class RestauranteService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/api/solicitacoes-cadastro`;

  solicitarLogin(solicitacao: SolicitacaoCadastro): Observable<void> {
    return this.http.post<void>(this.endpoint, solicitacao);
  }
}
