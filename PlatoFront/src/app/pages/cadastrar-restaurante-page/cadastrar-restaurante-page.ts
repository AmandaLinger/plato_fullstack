import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { BtnOrange } from '../../components/btn-orange/btn-orange';
import { RestauranteService } from '../../services/restaurante.service';

@Component({
  selector: 'app-cadastrar-restaurante-page',
  imports: [ReactiveFormsModule, RouterLink, BtnOrange],
  templateUrl: './cadastrar-restaurante-page.html',
  styleUrl: './cadastrar-restaurante-page.scss',
})
export class CadastrarRestaurantePage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly restauranteService = inject(RestauranteService);

  readonly form = this.formBuilder.nonNullable.group({
    nomeEstabelecimento: ['', [Validators.required, Validators.maxLength(120)]],
    nomeResponsavel: ['', [Validators.required, Validators.maxLength(120)]],
    telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)]],
  });

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  formatPhone(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 11);
    let formatted = digits;
    if (digits.length > 2) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    if (digits.length > 6) {
      const prefixLength = digits.length === 11 ? 7 : 6;
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, prefixLength)}-${digits.slice(prefixLength)}`;
    }
    this.form.controls.telefone.setValue(formatted);
  }

  submit(): void {
    if (this.form.invalid || this.isSubmitting) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.restauranteService
      .solicitarLogin({
        nomeEstabelecimento: value.nomeEstabelecimento.trim(),
        nomeResponsavel: value.nomeResponsavel.trim(),
        telefone: value.telefone,
      })
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.form.reset();
          this.successMessage =
            'Solicitação enviada com sucesso! Entraremos em contato para liberar seu acesso.';
        },
        error: () => {
          this.errorMessage = 'Não foi possível enviar a solicitação. Tente novamente mais tarde.';
        },
      });
  }
}
