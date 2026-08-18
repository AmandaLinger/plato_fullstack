import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConsumoMesa } from '../../models/pedido.models';

@Component({
  selector: 'app-modal-detalhes-mesa',
  imports: [CurrencyPipe, DatePipe, DecimalPipe],
  templateUrl: './modal-detalhes-mesa.html',
  styleUrl: './modal-detalhes-mesa.scss',
})
export class ModalDetalhesMesa {
  @Input() mesaNumero: number | null = null;
  @Input() consumo: ConsumoMesa | null = null;
  @Input() isLoading = false;
  @Input() errorMessage = '';
  @Output() readonly closed = new EventEmitter<void>();
  @Output() readonly addItems = new EventEmitter<void>();
}
