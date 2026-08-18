import { Component, OnInit, inject } from '@angular/core';
import { finalize } from 'rxjs';
import { BtnBack } from '../../components/btn-back/btn-back';
import { ModalFornecedorForm } from '../../components/modal-fornecedor-form/modal-fornecedor-form';
import { Fornecedor, FornecedorCadastro } from '../../models/configuracoes.models';
import { FornecedoresService } from '../../services/fornecedores.service';

@Component({ selector: 'app-fornecedores-page', imports: [BtnBack, ModalFornecedorForm], templateUrl: './fornecedores-page.html', styleUrl: './fornecedores-page.scss' })
export class FornecedoresPage implements OnInit {
  private readonly fornecedoresService = inject(FornecedoresService);
  fornecedores: Fornecedor[] = [];
  isModalOpen = false;
  isLoading = true;
  isSaving = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.loadFornecedores();
  }

  addFornecedor(fornecedor: FornecedorCadastro): void {
    if (this.isSaving) {
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.fornecedoresService
      .salvarFornecedor(fornecedor)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: (fornecedorCriado) => {
          this.fornecedores = [...this.fornecedores, fornecedorCriado];
          this.isModalOpen = false;
          this.successMessage = 'Fornecedor cadastrado com sucesso.';
        },
        error: () => {
          this.errorMessage = 'Não foi possível salvar o fornecedor.';
        },
      });
  }

  private loadFornecedores(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.fornecedoresService
      .listarFornecedores()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (fornecedores) => (this.fornecedores = [...fornecedores]),
        error: () => {
          this.fornecedores = [];
          this.errorMessage = 'Não foi possível carregar os fornecedores.';
        },
      });
  }
}
