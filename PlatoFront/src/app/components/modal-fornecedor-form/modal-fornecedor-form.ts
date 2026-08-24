import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, finalize, map } from 'rxjs';
import { Fornecedor, FornecedorCadastro } from '../../models/configuracoes.models';
import { FornecedoresService } from '../../services/fornecedores.service';
import { IconButton } from '../icon-button/icon-button';

@Component({ selector: 'app-modal-fornecedor-form', imports: [ReactiveFormsModule, IconButton], templateUrl: './modal-fornecedor-form.html', styleUrl: './modal-fornecedor-form.scss' })
export class ModalFornecedorForm implements OnChanges {
  @Input() fornecedor: Fornecedor | null = null;
  @Output() readonly closed = new EventEmitter<void>();
  @Output() readonly saved = new EventEmitter<Fornecedor>();
  @Output() readonly deleted = new EventEmitter<number>();
  private readonly formBuilder = inject(FormBuilder);
  private readonly fornecedoresService = inject(FornecedoresService);

  readonly form = this.formBuilder.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(100)]],
    cnpj: ['', [Validators.maxLength(30)]],
    telefone: ['', [Validators.maxLength(30)]],
  });
  isSaving = false;
  isDeleting = false;
  saveError = '';

  get isEditing(): boolean { return this.fornecedor !== null; }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fornecedor']) {
      this.saveError = '';
      this.form.reset({ nome: this.fornecedor?.nome ?? '', cnpj: this.fornecedor?.cnpj ?? '', telefone: this.fornecedor?.telefone ?? '' });
    }
  }

  close(): void {
    if (!this.isSaving && !this.isDeleting) this.closed.emit();
  }

  save(): void {
    if (this.form.invalid || this.isSaving || this.isDeleting) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const payload: FornecedorCadastro = { nome: value.nome.trim(), cnpj: value.cnpj.trim(), telefone: value.telefone.trim() };
    const request: Observable<Fornecedor> = this.fornecedor
      ? this.fornecedoresService
          .atualizarFornecedor(this.fornecedor.id, payload)
          .pipe(map(() => ({ ...this.fornecedor!, ...payload })))
      : this.fornecedoresService.salvarFornecedor(payload);

    this.isSaving = true;
    this.saveError = '';
    request.pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: (salvo) => this.saved.emit(salvo),
      error: () => (this.saveError = 'Não foi possível salvar o fornecedor. Tente novamente.'),
    });
  }

  inactivate(): void {
    const id = this.fornecedor?.id;
    if (id === undefined || this.isSaving || this.isDeleting) return;
    this.isDeleting = true;
    this.saveError = '';
    this.fornecedoresService.inativarFornecedor(id).pipe(finalize(() => (this.isDeleting = false))).subscribe({
      next: () => this.deleted.emit(id),
      error: () => (this.saveError = 'Não foi possível inativar o fornecedor. Tente novamente.'),
    });
  }
}
