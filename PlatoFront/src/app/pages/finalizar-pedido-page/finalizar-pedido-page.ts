import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { finalize } from 'rxjs';
import { BtnBack } from '../../components/btn-back/btn-back';
import { BtnOrange } from '../../components/btn-orange/btn-orange';
import { FeedbackToast } from '../../components/feedback-toast/feedback-toast';
import { ModalFinalizarNota } from '../../components/modal-finalizar-nota/modal-finalizar-nota';
import { FinalizacaoNota, NotaFiscalPendente } from '../../models/pedido.models';
import { MesasService } from '../../services/mesas.service';
import { PedidosService } from '../../services/pedidos.service';

@Component({
  selector: 'app-finalizar-pedido-page',
  imports: [CurrencyPipe, BtnBack, BtnOrange, FeedbackToast, ModalFinalizarNota],
  templateUrl: './finalizar-pedido-page.html',
  styleUrl: './finalizar-pedido-page.scss',
})
export class FinalizarPedidoPage implements OnInit {
  private readonly mesasService = inject(MesasService);
  private readonly pedidosService = inject(PedidosService);

  notasFiscais: NotaFiscalPendente[] = [];

  notaSelecionada: NotaFiscalPendente | null = null;
  notaFinalizada: NotaFiscalPendente | null = null;
  isLoading = true;
  errorMessage = '';
  isFinalizing = false;
  finalizeError = '';

  ngOnInit(): void {
    this.loadPedidosOcupados();
  }

  openFinalizeModal(notaFiscal: NotaFiscalPendente): void {
    this.finalizeError = '';
    this.notaSelecionada = notaFiscal;
  }

  closeFinalizeModal(): void {
    if (!this.isFinalizing) {
      this.notaSelecionada = null;
      this.finalizeError = '';
    }
  }

  finalizeNote(finalizacao: FinalizacaoNota): void {
    const notaFiscal = this.notasFiscais.find((nota) => nota.id === finalizacao.notaFiscalId) ?? null;

    if (!notaFiscal) {
      return;
    }

    const pedidoIds = finalizacao.notaFiscalId
      .split(',')
      .map(Number)
      .filter((id) => Number.isInteger(id) && id > 0);

    if (pedidoIds.length === 0 || this.isFinalizing) {
      return;
    }

    this.isFinalizing = true;
    this.finalizeError = '';
    this.pedidosService
      .finalizar(pedidoIds)
      .pipe(finalize(() => (this.isFinalizing = false)))
      .subscribe({
        next: () => {
          this.notaFinalizada = notaFiscal;
          this.notasFiscais = this.notasFiscais.filter(
            (nota) => nota.id !== finalizacao.notaFiscalId,
          );
          this.notaSelecionada = null;
        },
        error: () => {
          this.finalizeError = 'Não foi possível finalizar o pedido. Tente novamente.';
        },
      });
  }

  private loadPedidosOcupados(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.mesasService
      .listarConsumosOcupados()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (consumos) => {
          this.notasFiscais = consumos.map((consumo) => ({
            id: consumo.pedidoId,
            mesa: `Mesa ${String(consumo.mesaNumero).padStart(2, '0')}`,
            produtos: consumo.itens.map((item) => ({
              nome: item.produtoNome,
              quantidade: item.quantidade,
            })),
            valorTotal: consumo.valorTotal,
          }));
        },
        error: () => {
          this.notasFiscais = [];
          this.errorMessage = 'Não foi possível carregar as mesas ocupadas.';
        },
      });
  }
}
