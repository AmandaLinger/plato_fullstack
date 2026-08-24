export interface Funcionario {
  readonly id: number;
  readonly nome: string;
  readonly telefone: string;
  readonly cargo: string;
  readonly acesso: 'GERENTE' | 'ATENDENTE' | 'CAIXA';
}

export type FuncionarioCadastro = Omit<Funcionario, 'id'>;

export interface Fornecedor {
  readonly id: number;
  readonly nome: string;
  readonly cnpj: string;
  readonly telefone: string;
}

export type FornecedorCadastro = Omit<Fornecedor, 'id'>;

/** Estrutura retornada pelo endpoint GET /usuario. */
export interface Usuario {
  readonly id: number;
  readonly nome: string;
  readonly senha: string;
}

/** Estrutura aceita pelo endpoint POST /usuario. */
export type UsuarioPayload = Omit<Usuario, 'id'>;

export interface NotaFornecedor {
  readonly id: number;
  readonly fornecedorId: number;
  readonly fornecedorNome: string;
  readonly dataEmissao: string;
  readonly numeroNota: string;
  readonly valorTotal: number | null;
  readonly chaveAcesso: string;
  readonly observacoes: string;
}

export type NotaFornecedorCadastro = Omit<NotaFornecedor, 'id' | 'fornecedorNome'>;
