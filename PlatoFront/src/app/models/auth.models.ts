export type NivelAcesso = 'ROOT' | 'GERENTE' | 'ATENDENTE' | 'CAIXA';

export interface PerfilUsuario {
  readonly id: number;
  readonly nome: string;
  readonly acesso: NivelAcesso;
  readonly restauranteId: number | null;
}

export interface LoginPayload {
  readonly restauranteId: number;
  readonly nome: string;
  readonly senha: string;
}

export interface LoginResponse {
  readonly token: string;
  readonly usuario: PerfilUsuario;
}

export interface TwoFactorRequiredResponse {
  readonly require2FA: true;
  readonly tempToken: string;
}

export type AuthLoginResponse = LoginResponse | TwoFactorRequiredResponse;

export interface VerifyTwoFactorPayload {
  readonly tempToken: string;
  readonly code: string;
}

export interface AtualizarPerfilPayload {
  readonly nome: string;
  readonly senha?: string;
}
