import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {FooterComponent} from '../../components/footer-component/footer-component';
import {BtnOrange} from '../../components/btn-orange/btn-orange';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { FeedbackToast } from '../../components/feedback-toast/feedback-toast';

@Component({
  selector: 'app-login-page',
  imports: [FooterComponent, BtnOrange, RouterLink, ReactiveFormsModule, FeedbackToast],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly form = this.formBuilder.nonNullable.group({
    nome: ['', Validators.required],
    senha: ['', Validators.required],
  });

  isLoading = false;
  errorMessage = '';

  submit(): void {
    if (this.form.invalid || this.isLoading) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.isLoading = true;
    this.errorMessage = '';
    this.authService
      .login({ nome: value.nome.trim(), senha: value.senha })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          const destination =
            returnUrl?.startsWith('/') && !returnUrl.startsWith('//') ? returnUrl : '/home';
          void this.router.navigateByUrl(destination);
        },
        error: () => (this.errorMessage = 'Login ou senha inválidos.'),
      });
  }

}
