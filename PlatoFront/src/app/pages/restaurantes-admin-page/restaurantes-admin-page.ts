import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FeedbackToast } from '../../components/feedback-toast/feedback-toast';
import { Restaurante, RestauranteService } from '../../services/restaurante.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({ selector: 'app-restaurantes-admin-page', imports: [ReactiveFormsModule, RouterLink, FeedbackToast], templateUrl: './restaurantes-admin-page.html', styleUrl: './restaurantes-admin-page.scss' })
export class RestaurantesAdminPage implements OnInit {
  private readonly service = inject(RestauranteService);
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  restaurantes: readonly Restaurante[] = [];
  successMessage = '';
  errorMessage = '';
  readonly restauranteForm = this.fb.nonNullable.group({ nome: ['', Validators.required] });
  readonly gerenteForm = this.fb.nonNullable.group({ restauranteId: [0, Validators.min(1)], nome: ['', Validators.required], senha: ['', [Validators.required, Validators.minLength(8)]] });

  ngOnInit(): void { this.carregar(); }
  carregar(): void { this.service.listarAtivos().subscribe({ next: value => this.restaurantes = value, error: () => this.errorMessage = 'Não foi possível carregar os restaurantes.' }); }
  criar(): void {
    if (this.restauranteForm.invalid) return;
    this.service.criar(this.restauranteForm.getRawValue().nome.trim()).subscribe({ next: item => { this.restaurantes = [...this.restaurantes, item]; this.restauranteForm.reset(); this.successMessage = 'Restaurante criado com sucesso.'; }, error: () => this.errorMessage = 'Não foi possível criar o restaurante.' });
  }
  criarGerente(): void {
    if (this.gerenteForm.invalid) return;
    const value = this.gerenteForm.getRawValue();
    this.service.criarPrimeiroGerente(value.restauranteId, { nome: value.nome.trim(), senha: value.senha }).subscribe({ next: () => { this.gerenteForm.reset(); this.successMessage = 'Primeiro gerente criado com sucesso.'; }, error: () => this.errorMessage = 'Não foi possível criar o primeiro gerente.' });
  }
  inativar(id: number): void { this.service.inativar(id).subscribe({ next: () => { this.restaurantes = this.restaurantes.filter(item => item.id !== id); this.successMessage = 'Restaurante inativado.'; }, error: () => this.errorMessage = 'Não foi possível inativar o restaurante.' }); }
  sair(): void { this.auth.clearToken(); void this.router.navigate(['/login']); }
}
