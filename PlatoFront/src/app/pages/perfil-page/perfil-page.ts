import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { BtnBack } from '../../components/btn-back/btn-back';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-perfil-page',
  imports: [BtnBack, ReactiveFormsModule],
  templateUrl: './perfil-page.html',
  styleUrl: './perfil-page.scss',
})
export class PerfilPage implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly form = this.formBuilder.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(120)]],
    senha: ['', [Validators.minLength(8), Validators.maxLength(72)]],
  });

  private savedLogin = '';
  isLoading = false;
  isSaving = false;
  successMessage = '';
  errorMessage = '';

  ngOnInit(): void {
    this.loadProfile();
  }

  save(): void {
    if (this.form.invalid || this.isSaving || this.isLoading) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const senha = value.senha.trim();
    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.authService
      .atualizarPerfil({
        nome: value.nome.trim(),
        ...(senha ? { senha } : {}),
      })
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: (perfil) => {
          this.savedLogin = perfil.nome;
          this.form.reset({ nome: perfil.nome, senha: '' });
          this.successMessage = 'Perfil atualizado com sucesso.';
        },
        error: (error: { status?: number }) => {
          this.errorMessage =
            error.status === 401
              ? 'Sua sessão expirou. Faça login novamente.'
              : 'Não foi possível atualizar o perfil. Verifique os dados e tente novamente.';
        },
      });
  }

  cancel(): void {
    this.form.reset({ nome: this.savedLogin, senha: '' });
    this.successMessage = '';
    this.errorMessage = '';
  }

  private loadProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.authService
      .buscarPerfil()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (perfil) => {
          this.savedLogin = perfil.nome;
          this.form.reset({ nome: perfil.nome, senha: '' });
        },
        error: (error: { status?: number }) => {
          this.errorMessage =
            error.status === 401
              ? 'Sua sessão expirou. Faça login novamente.'
              : 'Não foi possível carregar seu perfil.';
        },
      });
  }

}
