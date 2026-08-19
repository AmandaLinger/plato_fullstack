import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { finalize, forkJoin } from 'rxjs';
import { BtnBack } from '../../components/btn-back/btn-back';
import { ModalNotaFornecedor } from '../../components/modal-nota-fornecedor/modal-nota-fornecedor';
import {
  ModalExportarNotas,
  PeriodoRelatorio,
} from '../../components/modal-exportar-notas/modal-exportar-notas';
import { Fornecedor, NotaFornecedor, NotaFornecedorCadastro } from '../../models/configuracoes.models';
import { FornecedoresService } from '../../services/fornecedores.service';
import { NotasFornecedorService } from '../../services/notas-fornecedor.service';

@Component({
  selector: 'app-nota-fornecedor-page',
  imports: [CurrencyPipe, DatePipe, BtnBack, ModalNotaFornecedor, ModalExportarNotas],
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
  isExportModalOpen = false;
  isDownloading = false;
  downloadError = '';

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

  openExportModal(): void {
    this.downloadError = '';
    this.isExportModalOpen = true;
  }

  closeExportModal(): void {
    if (!this.isDownloading) {
      this.isExportModalOpen = false;
      this.downloadError = '';
    }
  }

  exportNotas(periodo: PeriodoRelatorio): void {
    if (this.isDownloading) {
      return;
    }

    this.isDownloading = true;
    this.downloadError = '';
    this.notasService
      .exportarPorPeriodo(periodo.inicio, periodo.fim)
      .pipe(finalize(() => (this.isDownloading = false)))
      .subscribe({
        next: (report) => {
          this.downloadFile(
            report,
            `notas-fornecedores_${periodo.inicio}_a_${periodo.fim}.csv`,
          );
          this.isExportModalOpen = false;
        },
        error: () => {
          this.downloadError = 'Não foi possível gerar o relatório. Tente novamente.';
        },
      });
  }

  private downloadFile(file: Blob, filename: string): void {
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }
}
