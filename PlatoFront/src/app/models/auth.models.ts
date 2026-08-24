export interface PerfilUsuario {
  readonly id: number;
  readonly nome: string;
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

export interface AtualizarPerfilPayload {
  readonly nome: string;
  readonly senha?: string;
}
