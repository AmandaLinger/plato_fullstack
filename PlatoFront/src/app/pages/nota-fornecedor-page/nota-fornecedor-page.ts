import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { finalize, forkJoin } from 'rxjs';
import { BtnBack } from '../../components/btn-back/btn-back';
import { ModalNotaFornecedor } from '../../components/modal-nota-fornecedor/modal-nota-fornecedor';
import { Fornecedor, NotaFornecedor, NotaFornecedorCadastro } from '../../models/configuracoes.models';
import { FornecedoresService } from '../../services/fornecedores.service';
import { NotasFornecedorService } from '../../services/notas-fornecedor.service';

@Component({
  selector: 'app-nota-fornecedor-page',
  imports: [CurrencyPipe, DatePipe, BtnBack, ModalNotaFornecedor],
  templateUrl: './nota-fornecedor-page.html',
  styleUrl: './nota-fornecedor-page.scss',
})
export class NotaFornecedorPage implements OnInit {
  private readonly fornecedoresService = inject(FornecedoresService);
  private readonly notasService = inject(NotasFornecedorService);

  fornecedores: readonly Fornecedor[] = [];
  notas: readonly NotaFornecedor[] = [];
  isLoading = true;
  isModalOpen = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      fornecedores: this.fornecedoresService.listarFornecedores(),
      notas: this.notasService.listar(),
    })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: ({ fornecedores, notas }) => {
          this.fornecedores = fornecedores;
          this.notas = notas;
        },
        error: () => (this.errorMessage = 'Não foi possível carregar as notas de fornecedores.'),
      });
  }

  saveNota(nota: NotaFornecedorCadastro): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.notasService.salvarNota(nota).subscribe({
      next: (notaCriada) => {
        this.notas = [...this.notas, notaCriada];
        this.isModalOpen = false;
        this.successMessage = 'Nota de fornecedor salva com sucesso.';
      },
      error: () => (this.errorMessage = 'Não foi possível salvar a nota de fornecedor.'),
    });
  }
}
