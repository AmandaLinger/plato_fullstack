import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { Funcionario, FuncionarioCadastro } from '../../models/configuracoes.models';
import { FuncionariosService } from '../../services/funcionarios.service';

@Component({
  selector: 'app-modal-funcionario-form',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-funcionario-form.html',
  styleUrl: './modal-funcionario-form.scss',
})
export class ModalFuncionarioForm {
  @Output() readonly closed = new EventEmitter<void>();
  @Output() readonly saved = new EventEmitter<Funcionario>();
  private readonly formBuilder = inject(FormBuilder);
  private readonly funcionariosService = inject(FuncionariosService);

  readonly form = this.formBuilder.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(100)]],
    telefone: ['', [Validators.required, Validators.maxLength(30)]],
    cargo: ['', [Validators.required, Validators.maxLength(80)]],
  });
  isSaving = false;
  saveError = '';

  close(): void {
    if (!this.isSaving) {
      this.closed.emit();
    }
  }

  save(): void {
    if (this.form.invalid || this.isSaving) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: FuncionarioCadastro = {
      nome: value.nome.trim(),
      telefone: value.telefone.trim(),
      cargo: value.cargo.trim(),
    };

    this.isSaving = true;
    this.saveError = '';
    this.funcionariosService
      .criar(payload)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: (funcionario) => this.saved.emit(funcionario),
        error: () => {
          this.saveError = 'Não foi possível cadastrar o funcionário. Tente novamente.';
        },
      });
  }
}
