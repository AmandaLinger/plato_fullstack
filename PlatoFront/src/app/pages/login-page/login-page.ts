import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {FooterComponent} from '../../components/footer-component/footer-component';
import {BtnOrange} from '../../components/btn-orange/btn-orange';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { FeedbackToast } from '../../components/feedback-toast/feedback-toast';
import { Restaurante, RestauranteService } from '../../services/restaurante.service';

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
  });

  isLoading = false;
  isLoadingRestaurantes = true;
  restaurantes: readonly Restaurante[] = [];
  errorMessage = '';

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

    const value = this.form.getRawValue();
    this.isLoading = true;
    this.errorMessage = '';
    this.authService
      .login({ restauranteId: value.restauranteId, nome: value.nome.trim(), senha: value.senha })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          const destination = returnUrl?.startsWith('/') && !returnUrl.startsWith('//')
            ? returnUrl
            : response.usuario.acesso === 'ROOT' ? '/admin/restaurantes' : '/home';
          void this.router.navigateByUrl(destination);
        },
        error: () => (this.errorMessage = 'Login ou senha inválidos.'),
      });
  }

}
