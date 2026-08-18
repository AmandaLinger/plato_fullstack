import { DecimalPipe } from '@angular/common';
import { Component, DestroyRef, OnDestroy, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { BtnBack } from '../../components/btn-back/btn-back';
import { ModalDetalhesMesa } from '../../components/modal-detalhes-mesa/modal-detalhes-mesa';
import { ModalReservarMesa } from '../../components/modal-reservar-mesa/modal-reservar-mesa';
import { ConsumoMesa, Mesa, ReservaMesa, StatusMesa } from '../../models/pedido.models';
import { MesasService } from '../../services/mesas.service';

@Component({
  selector: 'app-consultar-mesas-page',
  imports: [DecimalPipe, BtnBack, ModalDetalhesMesa, ModalReservarMesa],
  templateUrl: './consultar-mesas-page.html',
  styleUrl: './consultar-mesas-page.scss',
})
export class ConsultarMesasPage implements OnInit, OnDestroy {
  private readonly mesasService = inject(MesasService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private requestVersion = 0;

  mesas: readonly Mesa[] = [];

  mesaSelecionada: Mesa | null = null;
  consumo: ConsumoMesa | null = null;
  isModalOpen = false;
  isReservationModalOpen = false;
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadMesas();
  }

  ngOnDestroy(): void {
    this.requestVersion += 1;
  }

  selectMesa(mesa: Mesa): void {
    if (mesa.status !== ('Ocupada' satisfies StatusMesa)) {
      return;
    }

    const requestId = ++this.requestVersion;
    this.mesaSelecionada = mesa;
    this.consumo = null;
    this.errorMessage = '';
    this.isLoading = true;
    this.isModalOpen = true;

    this.mesasService
      .buscarConsumo(mesa.numero)
      .pipe(finalize(() => {
        if (requestId === this.requestVersion) {
          this.isLoading = false;
        }
      }))
      .subscribe({
        next: (consumo) => {
          if (requestId === this.requestVersion) {
            this.consumo = consumo;
          }
        },
        error: () => {
          if (requestId === this.requestVersion) {
            this.errorMessage = 'Não foi possível carregar o consumo desta mesa.';
          }
        },
      });
  }

  closeModal(): void {
    this.requestVersion += 1;
    this.isModalOpen = false;
    this.mesaSelecionada = null;
    this.consumo = null;
    this.isLoading = false;
  }

  addMoreItems(): void {
    this.closeModal();
    void this.router.navigate(['/fazer-pedido']);
  }

  openReservationModal(): void {
    this.isReservationModalOpen = true;
  }

  closeReservationModal(): void {
    this.isReservationModalOpen = false;
  }

  saveReservation(reserva: ReservaMesa): void {
    this.mesasService.reservarMesa(reserva);
    this.closeReservationModal();
  }

  cancelReservation(mesaNumero: number): void {
    this.mesasService.cancelarReserva(mesaNumero);
  }

  private loadMesas(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.mesasService
      .listarMesas()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (mesas) => {
          this.mesas = mesas;
          this.isLoading = false;
        },
        error: () => {
          this.mesas = Array.from(
            { length: this.mesasService.getTotalMesas() },
            (_, index): Mesa => ({ numero: index + 1, status: 'Livre' }),
          );
          this.errorMessage = 'Não foi possível consultar os pedidos das mesas.';
          this.isLoading = false;
        },
      });
  }
}
