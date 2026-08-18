import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { finalize } from 'rxjs';
import { BtnOrange } from '../../components/btn-orange/btn-orange';
import { BtnBack } from '../../components/btn-back/btn-back';
import { ModalConfirmarPedido } from '../../components/modal-confirmar-pedido/modal-confirmar-pedido';
import { ModalDetalheProduto } from '../../components/modal-detalhe-produto/modal-detalhe-produto';
import { ItemPedido, Pedido, Produto, SelecaoProduto } from '../../models/pedido.models';
import { PedidosService } from '../../services/pedidos.service';
import { ProdutosService } from '../../services/produtos.service';

@Component({
  selector: 'app-fazer-pedido-page',
  imports: [CurrencyPipe, BtnOrange, BtnBack, ModalDetalheProduto, ModalConfirmarPedido],
  templateUrl: './fazer-pedido-page.html',
  styleUrl: './fazer-pedido-page.scss',
})
export class FazerPedidoPage implements OnInit {
  private readonly produtosService = inject(ProdutosService);
  private readonly pedidosService = inject(PedidosService);

  produtos: readonly Produto[] = [];

  itens: ItemPedido[] = [];
  produtoSelecionado: Produto | null = null;
  isProductModalOpen = false;
  isConfirmationModalOpen = false;
  pedidoConfirmado: Pedido | null = null;
  isLoadingProdutos = true;
  isSubmitting = false;
  produtosError = '';
  pedidoError = '';

  ngOnInit(): void {
    this.loadProdutos();
  }

  get valorTotal(): number {
    return this.itens.reduce((total, item) => total + item.subtotal, 0);
  }

  openProductModal(produto: Produto): void {
    this.produtoSelecionado = produto;
    this.isProductModalOpen = true;
  }

  closeProductModal(): void {
    this.isProductModalOpen = false;
    this.produtoSelecionado = null;
  }

  addItem(selecao: SelecaoProduto): void {
    this.itens = [
      ...this.itens,
      { ...selecao, subtotal: selecao.produto.preco * selecao.quantidade },
    ];
    this.closeProductModal();
  }

  increaseItemQuantity(index: number): void {
    this.updateItemQuantity(index, this.itens[index].quantidade + 1);
  }

  decreaseItemQuantity(index: number): void {
    this.updateItemQuantity(index, this.itens[index].quantidade - 1);
  }

  removeItem(index: number): void {
    this.itens = this.itens.filter((_, itemIndex) => itemIndex !== index);
  }

  openConfirmationModal(): void {
    if (this.itens.length > 0) {
      this.pedidoError = '';
      this.isConfirmationModalOpen = true;
    }
  }

  closeConfirmationModal(): void {
    this.isConfirmationModalOpen = false;
  }

  confirmOrder(pedido: Pedido): void {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.pedidoError = '';
    this.pedidosService
      .criar(pedido)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.pedidoConfirmado = pedido;
          this.itens = [];
          this.closeConfirmationModal();
        },
        error: () => {
          this.pedidoError = 'Não foi possível concluir o pedido. Verifique o backend e tente novamente.';
        },
      });
  }

  private loadProdutos(): void {
    this.isLoadingProdutos = true;
    this.produtosError = '';
    this.produtosService
      .listar()
      .pipe(finalize(() => (this.isLoadingProdutos = false)))
      .subscribe({
        next: (produtos) => (this.produtos = produtos),
        error: () => {
          this.produtos = [];
          this.produtosError = 'Não foi possível carregar os produtos cadastrados.';
        },
      });
  }

  private updateItemQuantity(index: number, quantidade: number): void {
    if (quantidade < 1) {
      this.removeItem(index);
      return;
    }

    this.itens = this.itens.map((item, itemIndex) =>
      itemIndex === index
        ? { ...item, quantidade, subtotal: item.produto.preco * quantidade }
        : item,
    );
  }
}
