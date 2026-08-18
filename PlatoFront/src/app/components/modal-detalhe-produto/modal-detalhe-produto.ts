import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Produto, SelecaoProduto } from '../../models/pedido.models';

@Component({
  selector: 'app-modal-detalhe-produto',
  imports: [CurrencyPipe, FormsModule],
  templateUrl: './modal-detalhe-produto.html',
  styleUrl: './modal-detalhe-produto.scss',
})
export class ModalDetalheProduto {
  @Output() readonly closed = new EventEmitter<void>();
  @Output() readonly added = new EventEmitter<SelecaoProduto>();

  private selectedProduct: Produto | null = null;

  @Input()
  set produto(produto: Produto | null) {
    this.selectedProduct = produto;
    this.quantidade = 1;
    this.observacoes = '';
  }

  get produto(): Produto | null {
    return this.selectedProduct;
  }

  quantidade = 1;
  observacoes = '';

  increaseQuantity(): void {
    this.quantidade += 1;
  }

  decreaseQuantity(): void {
    if (this.quantidade > 1) {
      this.quantidade -= 1;
    }
  }

  addToOrder(): void {
    if (!this.produto || this.quantidade < 1) {
      return;
    }

    this.added.emit({
      produto: this.produto,
      quantidade: this.quantidade,
      observacoes: this.observacoes.trim(),
    });
  }
}
