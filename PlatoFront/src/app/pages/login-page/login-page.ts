import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {FooterComponent} from '../../components/footer-component/footer-component';
import {BtnOrange} from '../../components/btn-orange/btn-orange';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { finalize } from 'rxjs';
import { AuthRequestError, AuthService } from '../../services/auth.service';
import { FeedbackToast } from '../../components/feedback-toast/feedback-toast';
import { Restaurante, RestauranteService } from '../../services/restaurante.service';
import {
  AuthLoginResponse,
  LoginResponse,
  TwoFactorRequiredResponse,
} from '../../models/auth.models';

@Component({
  selector: 'app-login-page',
  imports: [FooterComponent, BtnOrange, RouterLink, ReactiveFormsModule, FeedbackToast],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly restauranteService = inject(RestauranteService);

  readonly form = this.formBuilder.nonNullable.group({
    restauranteId: [-1, [Validators.required, Validators.min(0)]],
    nome: ['', Validators.required],
    senha: ['', Validators.required],
    codigo2FA: [''],
  });

  isLoading = false;
  isLoadingRestaurantes = true;
  restaurantes: readonly Restaurante[] = [];
  errorMessage = '';
  requiresTwoFactor = false;
  private tempToken = '';

  ngOnInit(): void {
    this.restauranteService.listarAtivos().pipe(finalize(() => (this.isLoadingRestaurantes = false))).subscribe({
      next: (restaurantes) => {
        this.restaurantes = restaurantes;
        const salvo = this.authService.getRestauranteId();
        if (salvo && restaurantes.some((restaurante) => restaurante.id === salvo)) {
          this.form.controls.restauranteId.setValue(salvo);
        }
      },
      error: () => (this.errorMessage = 'Não foi possível carregar os restaurantes.'),
    });
  }

  submit(): void {
    if (this.form.invalid || this.isLoading) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.requiresTwoFactor) {
      this.verifyTwoFactor();
      return;
    }

    const value = this.form.getRawValue();
    this.isLoading = true;
    this.errorMessage = '';
    this.authService
      .login({ restauranteId: value.restauranteId, nome: value.nome.trim(), senha: value.senha })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => this.handleLoginResponse(response),
        error: (error: AuthRequestError) => {
          this.errorMessage = error.status === 401 ? 'Login ou senha inválidos.' : error.message;
        },
      });
  }

  cancelTwoFactor(): void {
    this.requiresTwoFactor = false;
    this.tempToken = '';
    this.form.controls.codigo2FA.reset();
    this.form.controls.codigo2FA.clearValidators();
    this.form.controls.codigo2FA.updateValueAndValidity();
    this.errorMessage = '';
  }

  private handleLoginResponse(response: AuthLoginResponse): void {
    if (this.isTwoFactorRequired(response)) {
      this.requiresTwoFactor = true;
      this.tempToken = response.tempToken;
      this.form.controls.codigo2FA.setValidators([
        Validators.required,
        Validators.pattern(/^(\d{6}|[A-Za-z2-9]{5}-?[A-Za-z2-9]{5})$/),
      ]);
      this.form.controls.codigo2FA.updateValueAndValidity();
      return;
    }
    this.finishLogin(response);
  }

  private verifyTwoFactor(): void {
    const codeControl = this.form.controls.codigo2FA;
    if (codeControl.invalid || this.isLoading) {
      codeControl.markAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.authService.verifyTwoFactor({ tempToken: this.tempToken, code: codeControl.value.trim() })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => this.finishLogin(response),
        error: (error: AuthRequestError) => {
          this.errorMessage = error.status === 401
            ? 'Código de autenticação inválido ou expirado.'
            : error.message;
        },
      });
  }

  private finishLogin(response: LoginResponse): void {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    const destination = returnUrl?.startsWith('/') && !returnUrl.startsWith('//')
      ? returnUrl
      : response.usuario.acesso === 'ROOT' ? '/admin/restaurantes' : '/home';
    void this.router.navigateByUrl(destination);
  }

  private isTwoFactorRequired(response: AuthLoginResponse): response is TwoFactorRequiredResponse {
    return 'require2FA' in response && response.require2FA === true;
  }

}
