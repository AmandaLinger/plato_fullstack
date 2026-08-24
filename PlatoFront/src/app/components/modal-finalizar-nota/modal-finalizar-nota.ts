import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import {
  FinalizacaoNota,
  FormaPagamento,
  NotaFiscalPendente,
} from '../../models/pedido.models';
import { Funcionario } from '../../models/configuracoes.models';
import { FuncionariosService } from '../../services/funcionarios.service';

interface OpcaoPagamento {
  readonly valor: FormaPagamento;
  readonly rotulo: string;
}

@Component({
  selector: 'app-modal-finalizar-nota',
  imports: [CurrencyPipe, FormsModule],
  templateUrl: './modal-finalizar-nota.html',
  styleUrl: './modal-finalizar-nota.scss',
})
export class ModalFinalizarNota implements OnInit, OnChanges {
  @Input() notaFiscal: NotaFiscalPendente | null = null;
  @Input() isSaving = false;
  @Input() saveError = '';
  @Output() readonly closed = new EventEmitter<void>();
  @Output() readonly finalized = new EventEmitter<FinalizacaoNota>();

  private readonly funcionariosService = inject(FuncionariosService);

  operadores: readonly Funcionario[] = [];

  readonly formasPagamento: readonly OpcaoPagamento[] = [
    { valor: 'dinheiro', rotulo: 'Dinheiro' },
    { valor: 'credito', rotulo: 'Cartão de crédito' },
    { valor: 'debito', rotulo: 'Cartão de débito' },
    { valor: 'voucher', rotulo: 'Voucher' },
    { valor: 'pix', rotulo: 'PIX' },
  ];

  operadorId = '';
  formaPagamento: FormaPagamento | '' = '';
  isLoadingOperadores = true;
  operadoresError = '';

  get canFinalize(): boolean {
    return Boolean(
      this.notaFiscal &&
        this.operadorId &&
        this.formaPagamento &&
        !this.isLoadingOperadores &&
        !this.isSaving,
    );
  }

  ngOnInit(): void {
    this.loadOperadores();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['notaFiscal']) {
      this.operadorId = '';
      this.formaPagamento = '';
    }
  }

  finalizeNote(): void {
    if (!this.notaFiscal || !this.operadorId || !this.formaPagamento || this.isSaving) {
      return;
    }

    this.finalized.emit({
      notaFiscalId: this.notaFiscal.id,
      operadorId: this.operadorId,
      formaPagamento: this.formaPagamento,
    });
  }

  close(): void {
    if (!this.isSaving) {
      this.closed.emit();
    }
  }

  private loadOperadores(): void {
    this.isLoadingOperadores = true;
    this.operadoresError = '';
    this.funcionariosService
      .listarAtivos()
      .pipe(finalize(() => (this.isLoadingOperadores = false)))
      .subscribe({
        next: (funcionarios) => (this.operadores = funcionarios),
        error: () => {
          this.operadores = [];
          this.operadoresError = 'Não foi possível carregar os funcionários.';
        },
      });
  }
}
