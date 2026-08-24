export interface Produto {
  readonly id: number;
  readonly nome: string;
  readonly descricao: string;
  readonly imagemUrl: string;
  readonly preco: number;
  readonly categoria: string;
}

export interface ProdutoPayload {
  readonly nome: string;
  readonly descricao: string;
  readonly imagemUrl: string;
  readonly preco: number;
  readonly categoria: string;
}

export interface SelecaoProduto {
  readonly produto: Produto;
  readonly quantidade: number;
  readonly observacoes: string;
}

export interface ItemPedido extends SelecaoProduto {
  readonly subtotal: number;
}

export interface Pedido {
  readonly mesa: string;
  readonly garcom: string;
  readonly garcomId?: number;
  readonly itens: readonly ItemPedido[];
  readonly valorTotal: number;
}

export interface ItemPedidoRegistrado {
  readonly id: number;
  readonly produto: Produto;
  readonly quantidade: number;
}

export interface PedidoRegistrado {
  readonly id: number;
  readonly numeroMesa: number;
  readonly itens: readonly ItemPedidoRegistrado[];
  readonly pedidoAberto: boolean;
  readonly dataPedido: string;
  readonly formaPagamento: FormaPagamento | null;
}

export interface ProdutoNotaFiscal {
  readonly nome: string;
  readonly quantidade: number;
}

export interface NotaFiscalPendente {
  readonly id: string;
  readonly mesa: string;
  readonly produtos: readonly ProdutoNotaFiscal[];
  readonly valorTotal: number;
}

export interface OperadorCaixa {
  readonly id: string;
  readonly nome: string;
}

export type FormaPagamento = 'dinheiro' | 'credito' | 'debito' | 'voucher' | 'pix';

export interface FinalizacaoNota {
  readonly notaFiscalId: string;
  readonly operadorId: string;
  readonly formaPagamento: FormaPagamento;
}

export type StatusMesa = 'Livre' | 'Ocupada' | 'Aguardando conta' | 'Reservada';

export interface ReservaMesa {
  readonly mesaNumero: number;
  readonly clienteNome: string;
  readonly horario: string;
}

export interface Mesa {
  readonly numero: number;
  readonly status: StatusMesa;
  readonly pedidoId?: string;
  readonly reserva?: ReservaMesa;
}

export interface ItemConsumoMesa {
  readonly id: string;
  readonly produtoNome: string;
  readonly quantidade: number;
  readonly observacoes: string;
  readonly precoUnitario: number;
  readonly subtotal: number;
}

export interface ConsumoMesa {
  readonly mesaNumero: number;
  readonly pedidoId: string;
  readonly abertoEm: string;
  readonly itens: readonly ItemConsumoMesa[];
  readonly valorTotal: number;
}
