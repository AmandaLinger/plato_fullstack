import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { BtnOrange } from '../../components/btn-orange/btn-orange';
import { BtnBack } from '../../components/btn-back/btn-back';
import {
  ModalExportarNotas,
  PeriodoRelatorio,
} from '../../components/modal-exportar-notas/modal-exportar-notas';
import { NotaFiscal, NotasFiscaisService } from '../../services/notas-fiscais.service';

@Component({
  selector: 'app-notas-do-dia-page',
  imports: [CurrencyPipe, DatePipe, FormsModule, BtnOrange, BtnBack, ModalExportarNotas],
  templateUrl: './notas-do-dia-page.html',
  styleUrl: './notas-do-dia-page.scss',
})
export class NotasDoDiaPage implements OnInit {
  private readonly notasFiscaisService = inject(NotasFiscaisService);

  dataSelecionada = '';
  notasFiscais: readonly NotaFiscal[] = [];
  isLoading = true;
  errorMessage = '';
  isExportModalOpen = false;
  isDownloading = false;
  downloadError = '';

  get totalNotas(): number {
    return this.notasFiscais.length;
  }

  get valorTotalAcumulado(): number {
    return this.notasFiscais.reduce((total, notaFiscal) => total + notaFiscal.valorTotal, 0);
  }

  ngOnInit(): void {
    this.dataSelecionada = this.formatDateForApi(new Date());
    this.loadNotasFiscais();
  }

  loadNotasFiscais(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.notasFiscaisService
      .listarPorData(this.dataSelecionada)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (notasFiscais) => {
          this.notasFiscais = notasFiscais;
        },
        error: () => {
          this.notasFiscais = [];
          this.errorMessage = 'Não foi possível carregar as notas fiscais do dia.';
        },
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
    this.notasFiscaisService
      .exportarPorPeriodo(periodo.inicio, periodo.fim)
      .pipe(finalize(() => (this.isDownloading = false)))
      .subscribe({
        next: (report) => {
          this.downloadFile(report, `notas-fiscais_${periodo.inicio}_a_${periodo.fim}.csv`);
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

  private formatDateForApi(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
