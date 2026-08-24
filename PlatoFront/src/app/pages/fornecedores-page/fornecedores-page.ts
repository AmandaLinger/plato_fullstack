import { Component, OnInit, inject } from '@angular/core';
import { finalize } from 'rxjs';
import { BtnBack } from '../../components/btn-back/btn-back';
import { FeedbackToast } from '../../components/feedback-toast/feedback-toast';
import { ModalFornecedorForm } from '../../components/modal-fornecedor-form/modal-fornecedor-form';
import { Fornecedor } from '../../models/configuracoes.models';
import { FornecedoresService } from '../../services/fornecedores.service';

@Component({ selector: 'app-fornecedores-page', imports: [BtnBack, FeedbackToast, ModalFornecedorForm], templateUrl: './fornecedores-page.html', styleUrl: './fornecedores-page.scss' })
export class FornecedoresPage implements OnInit {
  private readonly fornecedoresService = inject(FornecedoresService);
  fornecedores: readonly Fornecedor[] = [];
  fornecedorSelecionado: Fornecedor | null = null;
  isModalOpen = false;
  isLoading = true;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void { this.loadFornecedores(); }

  openCreateModal(): void { this.fornecedorSelecionado = null; this.isModalOpen = true; }
  openEditModal(fornecedor: Fornecedor): void { this.fornecedorSelecionado = fornecedor; this.isModalOpen = true; }
  closeModal(): void { this.isModalOpen = false; this.fornecedorSelecionado = null; }

  saveFornecedor(fornecedor: Fornecedor): void {
    const isEditing = this.fornecedorSelecionado !== null;
    this.fornecedores = isEditing
      ? this.fornecedores.map((item) => item.id === fornecedor.id ? fornecedor : item)
      : [...this.fornecedores, fornecedor];
    this.successMessage = isEditing ? 'Fornecedor atualizado com sucesso.' : 'Fornecedor cadastrado com sucesso.';
    this.errorMessage = '';
    this.closeModal();
  }

  removeFornecedor(id: number): void {
    this.fornecedores = this.fornecedores.filter((item) => item.id !== id);
    this.successMessage = 'Fornecedor inativado com sucesso.';
    this.errorMessage = '';
    this.closeModal();
  }

  private loadFornecedores(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.fornecedoresService.listarFornecedores().pipe(finalize(() => (this.isLoading = false))).subscribe({
      next: (fornecedores) => (this.fornecedores = fornecedores),
      error: () => { this.fornecedores = []; this.errorMessage = 'Não foi possível carregar os fornecedores.'; },
    });
  }
}
