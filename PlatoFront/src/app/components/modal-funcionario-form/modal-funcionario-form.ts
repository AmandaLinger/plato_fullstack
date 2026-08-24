import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, finalize, map } from 'rxjs';
import { Funcionario, FuncionarioCadastro } from '../../models/configuracoes.models';
import { FuncionariosService } from '../../services/funcionarios.service';
import { IconButton } from '../icon-button/icon-button';

@Component({ selector: 'app-modal-funcionario-form', imports: [ReactiveFormsModule, IconButton], templateUrl: './modal-funcionario-form.html', styleUrl: './modal-funcionario-form.scss' })
export class ModalFuncionarioForm implements OnChanges {
  @Input() funcionario: Funcionario | null = null;
  @Output() readonly closed = new EventEmitter<void>();
  @Output() readonly saved = new EventEmitter<Funcionario>();
  @Output() readonly deleted = new EventEmitter<number>();
  private readonly formBuilder = inject(FormBuilder);
  private readonly funcionariosService = inject(FuncionariosService);

  readonly form = this.formBuilder.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(100)]],
    telefone: ['', [Validators.required, Validators.maxLength(30)]],
    cargo: ['', [Validators.required, Validators.maxLength(80)]],
    acesso: ['ATENDENTE' as 'GERENTE' | 'ATENDENTE' | 'CAIXA', Validators.required],
  });
  isSaving = false;
  isDeleting = false;
  saveError = '';

  get isEditing(): boolean { return this.funcionario !== null; }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['funcionario']) {
      this.saveError = '';
      this.form.reset({ nome: this.funcionario?.nome ?? '', telefone: this.funcionario?.telefone ?? '', cargo: this.funcionario?.cargo ?? '', acesso: this.funcionario?.acesso ?? 'ATENDENTE' });
    }
  }

  close(): void { if (!this.isSaving && !this.isDeleting) this.closed.emit(); }

  save(): void {
    if (this.form.invalid || this.isSaving || this.isDeleting) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const payload: FuncionarioCadastro = { nome: value.nome.trim(), telefone: value.telefone.trim(), cargo: value.cargo.trim(), acesso: value.acesso };
    const request: Observable<Funcionario> = this.funcionario
      ? this.funcionariosService
          .atualizar(this.funcionario.id, payload)
          .pipe(map(() => ({ ...this.funcionario!, ...payload })))
      : this.funcionariosService.criar(payload);
    this.isSaving = true;
    this.saveError = '';
    request.pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: (salvo) => this.saved.emit(salvo),
      error: () => (this.saveError = 'Não foi possível salvar o funcionário. Tente novamente.'),
    });
  }

  inactivate(): void {
    const id = this.funcionario?.id;
    if (id === undefined || this.isSaving || this.isDeleting) return;
    this.isDeleting = true;
    this.saveError = '';
    this.funcionariosService.inativar(id).pipe(finalize(() => (this.isDeleting = false))).subscribe({
      next: () => this.deleted.emit(id),
      error: () => (this.saveError = 'Não foi possível inativar o funcionário. Tente novamente.'),
    });
  }
}
