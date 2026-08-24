import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { finalize } from 'rxjs';
import { BtnBack } from '../../components/btn-back/btn-back';
import { FeedbackToast } from '../../components/feedback-toast/feedback-toast';
import { ModalProdutoForm } from '../../components/modal-produto-form/modal-produto-form';
import { Produto } from '../../models/pedido.models';
import { ProdutosService } from '../../services/produtos.service';

@Component({
  selector: 'app-cardapio-edit-page',
  imports: [CurrencyPipe, BtnBack, FeedbackToast, ModalProdutoForm],
  templateUrl: './cardapio-edit-page.html',
  styleUrl: './cardapio-edit-page.scss',
})
export class CardapioEditPage implements OnInit {
  private readonly produtosService = inject(ProdutosService);

  produtos: readonly Produto[] = [];
  produtoSelecionado: Produto | null = null;
  isLoading = true;
  isModalOpen = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadProdutos();
  }

  loadProdutos(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.produtosService
      .listar()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (produtos) => (this.produtos = produtos),
        error: () => (this.errorMessage = 'Não foi possível carregar o cardápio.'),
      });
  }

  openCreateModal(): void {
    this.produtoSelecionado = null;
    this.isModalOpen = true;
  }

  openEditModal(produto: Produto): void {
    this.produtoSelecionado = produto;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.produtoSelecionado = null;
  }

  saveProduto(produto: Produto): void {
    const isEditing = this.produtoSelecionado !== null;
    this.errorMessage = '';
    this.produtos = isEditing
      ? this.produtos.map((item) => (item.id === produto.id ? produto : item))
      : [...this.produtos, produto];
    this.isModalOpen = false;
    this.produtoSelecionado = null;
  }

  deleteProduto(produto: Produto): void {
    this.errorMessage = '';
    this.produtosService.excluir(produto.id).subscribe({
      next: () => (this.produtos = this.produtos.filter((item) => item.id !== produto.id)),
      error: () => (this.errorMessage = 'Não foi possível excluir o produto. Tente novamente.'),
    });
  }
}
