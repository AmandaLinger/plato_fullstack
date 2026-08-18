import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Mesa, ReservaMesa } from '../../models/pedido.models';

@Component({
  selector: 'app-modal-reservar-mesa',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-reservar-mesa.html',
  styleUrl: './modal-reservar-mesa.scss',
})
export class ModalReservarMesa implements OnChanges {
  @Input() mesas: readonly Mesa[] = [];
  @Output() readonly closed = new EventEmitter<void>();
  @Output() readonly saved = new EventEmitter<ReservaMesa>();

  private readonly formBuilder = inject(FormBuilder);
  readonly form = this.formBuilder.nonNullable.group({
    mesaNumero: ['', Validators.required],
    clienteNome: ['', [Validators.required, Validators.pattern(/.*\S.*/)]],
    horario: ['', Validators.required],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mesas']) {
      this.form.reset({ mesaNumero: '', clienteNome: '', horario: '' });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const mesaNumero = Number(value.mesaNumero);
    if (!this.mesas.some((mesa) => mesa.numero === mesaNumero && mesa.status === 'Livre')) {
      this.form.controls.mesaNumero.setErrors({ unavailable: true });
      return;
    }

    this.saved.emit({
      mesaNumero,
      clienteNome: value.clienteNome.trim(),
      horario: value.horario,
    });
  }
}
