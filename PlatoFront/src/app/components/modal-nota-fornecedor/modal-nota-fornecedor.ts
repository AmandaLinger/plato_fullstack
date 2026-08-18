import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Fornecedor, NotaFornecedorCadastro } from '../../models/configuracoes.models';

@Component({
  selector: 'app-modal-nota-fornecedor',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-nota-fornecedor.html',
  styleUrl: './modal-nota-fornecedor.scss',
})
export class ModalNotaFornecedor {
  @Input() fornecedores: readonly Fornecedor[] = [];
  @Output() readonly closed = new EventEmitter<void>();
  @Output() readonly saved = new EventEmitter<NotaFornecedorCadastro>();
  private readonly formBuilder = inject(FormBuilder);

  readonly form = this.formBuilder.group({
    fornecedorId: ['', Validators.required],
    dataEmissao: ['', Validators.required],
    numeroNota: [''],
    valorTotal: [null as number | null, [Validators.min(0)]],
    chaveAcesso: ['', Validators.pattern(/^\d{44}$/)],
    observacoes: [''],
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.saved.emit({
      fornecedorId: value.fornecedorId ?? '',
      dataEmissao: value.dataEmissao ?? '',
      numeroNota: value.numeroNota?.trim() ?? '',
      valorTotal: value.valorTotal,
      chaveAcesso: value.chaveAcesso?.trim() ?? '',
      observacoes: value.observacoes?.trim() ?? '',
    });
  }
}
