import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FornecedorCadastro } from '../../models/configuracoes.models';

@Component({
  selector: 'app-modal-fornecedor-form',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-fornecedor-form.html',
  styleUrl: './modal-fornecedor-form.scss',
})
export class ModalFornecedorForm {
  @Output() readonly closed = new EventEmitter<void>();
  @Output() readonly saved = new EventEmitter<FornecedorCadastro>();
  private readonly formBuilder = inject(FormBuilder);

  readonly form = this.formBuilder.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(100)]],
    cnpj: ['', [Validators.maxLength(30)]],
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.saved.emit({ nome: value.nome.trim(), cnpj: value.cnpj.trim() });
  }
}
