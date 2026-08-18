import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { BtnOrange } from '../../components/btn-orange/btn-orange';
import { BtnBack } from '../../components/btn-back/btn-back';
import { NotaFiscal, NotasFiscaisService } from '../../services/notas-fiscais.service';

@Component({
  selector: 'app-notas-do-dia-page',
  imports: [CurrencyPipe, DatePipe, FormsModule, BtnOrange, BtnBack],
  templateUrl: './notas-do-dia-page.html',
  styleUrl: './notas-do-dia-page.scss',
})
export class NotasDoDiaPage implements OnInit {
  private readonly notasFiscaisService = inject(NotasFiscaisService);

  dataSelecionada = '';
  notasFiscais: readonly NotaFiscal[] = [];
  isLoading = true;
  errorMessage = '';

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

  private formatDateForApi(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
