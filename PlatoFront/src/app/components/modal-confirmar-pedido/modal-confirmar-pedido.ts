import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { FuncionariosService } from '../../services/funcionarios.service';
import { MesasService } from '../../services/mesas.service';
import { Funcionario } from '../../models/configuracoes.models';
import { ItemPedido, Pedido } from '../../models/pedido.models';

@Component({
  selector: 'app-modal-confirmar-pedido',
  imports: [CurrencyPipe, ReactiveFormsModule],
  templateUrl: './modal-confirmar-pedido.html',
  styleUrl: './modal-confirmar-pedido.scss',
})
export class ModalConfirmarPedido implements OnInit, OnChanges {
  @Input() itens: readonly ItemPedido[] = [];
  @Input() valorTotal = 0;
  @Output() readonly closed = new EventEmitter<void>();
  @Output() readonly confirmed = new EventEmitter<Pedido>();

  private readonly formBuilder = inject(FormBuilder);
  private readonly funcionariosService = inject(FuncionariosService);
  private readonly mesasService = inject(MesasService);
  readonly totalMesas = this.mesasService.totalMesas;

  readonly form = this.formBuilder.nonNullable.group({
    mesa: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\d+$/),
        Validators.min(1),
        Validators.max(this.totalMesas()),
      ],
    ],
    garcomId: ['', Validators.required],
    enviarCozinha: [true, Validators.required],
  });
  funcionarios: readonly Funcionario[] = [];
  isLoadingFuncionarios = true;
  funcionariosError = '';

  constructor() {
    effect(() => {
      this.form.controls.mesa.setValidators([
        Validators.required,
        Validators.pattern(/^\d+$/),
        Validators.min(1),
        Validators.max(this.totalMesas()),
      ]);
      this.form.controls.mesa.updateValueAndValidity({ emitEvent: false });
    });
  }

  ngOnInit(): void {
    this.loadFuncionarios();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itens']) {
      this.form.reset({ mesa: '', garcomId: '', enviarCozinha: true });
    }
  }

  private loadFuncionarios(): void {
    this.isLoadingFuncionarios = true;
    this.funcionariosError = '';

    this.funcionariosService
      .listarAtivos()
      .pipe(finalize(() => (this.isLoadingFuncionarios = false)))
      .subscribe({
        next: (funcionarios) => (this.funcionarios = funcionarios),
        error: () => {
          this.funcionarios = [];
          this.funcionariosError = 'Não foi possível carregar os funcionários.';
        },
      });
  }

  confirmOrder(): void {
    if (this.form.invalid || this.itens.length === 0) {
      this.form.markAllAsTouched();
      return;
    }

    const { mesa, garcomId, enviarCozinha } = this.form.getRawValue();
    const funcionario = this.funcionarios.find((item) => item.id === Number(garcomId));

    if (!funcionario) {
      return;
    }

    this.confirmed.emit({
      mesa: String(mesa).trim(),
      garcom: funcionario.nome,
      garcomId: funcionario.id,
      itens: this.itens,
      valorTotal: this.valorTotal,
      enviarCozinha,
    });
  }
}
