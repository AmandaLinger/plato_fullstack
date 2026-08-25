import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { FeedbackToast } from '../../components/feedback-toast/feedback-toast';
import { Restaurante, RestauranteService, SolicitacaoCadastro } from '../../services/restaurante.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({ selector: 'app-restaurantes-admin-page', imports: [ReactiveFormsModule, RouterLink, FeedbackToast], templateUrl: './restaurantes-admin-page.html', styleUrl: './restaurantes-admin-page.scss' })
export class RestaurantesAdminPage implements OnInit {
  private readonly service = inject(RestauranteService);
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  restaurantes: readonly Restaurante[] = [];
  restaurantesSemGerente: readonly Restaurante[] = [];
  successMessage = '';
  errorMessage = '';
  solicitacoes: readonly SolicitacaoCadastro[] = [];
  isSolicitacoesModalOpen = false;
  isLoadingSolicitacoes = false;
  solicitacoesError = '';
  solicitacaoEmExclusaoId: number | null = null;
  solicitacaoSelecionadaId: number | null = null;
  isAprovandoSolicitacao = false;
  isSenhaModalOpen = false;
  restauranteSenhaId: number | null = null;
  restauranteSenhaNome = '';
  isAtualizandoSenha = false;
  senhaError = '';
  readonly restauranteForm = this.fb.nonNullable.group({ nome: ['', Validators.required] });
  readonly gerenteForm = this.fb.nonNullable.group({ restauranteId: [0, Validators.min(1)], nome: ['', Validators.required], senha: ['', [Validators.required, Validators.minLength(8)]] });
  readonly senhaGerenteForm = this.fb.nonNullable.group({
    novaSenha: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
    confirmarSenha: ['', Validators.required],
  });

  get senhasNaoCoincidem(): boolean {
    const value = this.senhaGerenteForm.getRawValue();
    return value.confirmarSenha.length > 0 && value.novaSenha !== value.confirmarSenha;
  }

  get podeSalvarSenha(): boolean {
    return this.senhaGerenteForm.valid && !this.senhasNaoCoincidem && !this.isAtualizandoSenha;
  }

  ngOnInit(): void { this.carregar(); }
  abrirSolicitacoes(): void {
    this.isSolicitacoesModalOpen = true;
    this.isLoadingSolicitacoes = true;
    this.solicitacoesError = '';
    this.solicitacaoSelecionadaId = null;
    this.solicitacoes = [];
    this.service.listarSolicitacoesPendentes()
      .pipe(finalize(() => (this.isLoadingSolicitacoes = false)))
      .subscribe({
        next: solicitacoes => this.solicitacoes = solicitacoes.filter(item => item.status === 'PENDENTE'),
        error: () => this.solicitacoesError = 'Não foi possível carregar as solicitações.',
      });
  }
  fecharSolicitacoes(): void {
    if (!this.isLoadingSolicitacoes && !this.isAprovandoSolicitacao) {
      this.isSolicitacoesModalOpen = false;
      this.solicitacaoSelecionadaId = null;
    }
  }
  selecionarSolicitacao(solicitacao: SolicitacaoCadastro): void {
    this.solicitacaoSelecionadaId = solicitacao.id;
    this.restauranteForm.patchValue({ nome: solicitacao.nomeEstabelecimento });
    this.gerenteForm.patchValue({ nome: solicitacao.nomeResponsavel });
    this.solicitacoesError = '';
  }
  aprovarSolicitacao(): void {
    const id = this.solicitacaoSelecionadaId;
    if (id === null || this.isAprovandoSolicitacao) return;

    const solicitacao = this.solicitacoes.find(item => item.id === id);
    if (!solicitacao) {
      this.solicitacoesError = 'A solicitação selecionada não está mais disponível.';
      return;
    }

    this.isAprovandoSolicitacao = true;
    this.solicitacoesError = '';
    this.service.aprovarSolicitacao(id)
      .pipe(finalize(() => (this.isAprovandoSolicitacao = false)))
      .subscribe({
        next: restaurante => {
          this.solicitacoes = this.solicitacoes.filter(item => item.id !== id);
          this.restaurantes = [...this.restaurantes, restaurante];
          this.restaurantesSemGerente = [...this.restaurantesSemGerente, restaurante];
          this.gerenteForm.patchValue({ restauranteId: restaurante.id, nome: solicitacao.nomeResponsavel });
          this.restauranteForm.reset();
          this.isSolicitacoesModalOpen = false;
          this.solicitacaoSelecionadaId = null;
          this.successMessage = `Solicitação de ${restaurante.nome} aprovada com sucesso.`;
        },
        error: () => this.solicitacoesError = 'Não foi possível aprovar a solicitação. Tente novamente.',
      });
  }
  rejeitarSolicitacao(id: number): void {
    this.solicitacaoEmExclusaoId = id;
    this.solicitacoesError = '';
    this.service.rejeitarSolicitacao(id)
      .pipe(finalize(() => (this.solicitacaoEmExclusaoId = null)))
      .subscribe({
        next: () => {
          this.solicitacoes = this.solicitacoes.filter(item => item.id !== id);
          if (this.solicitacaoSelecionadaId === id) this.solicitacaoSelecionadaId = null;
        },
        error: () => this.solicitacoesError = 'Não foi possível excluir a solicitação.',
      });
  }
  carregar(): void {
    this.service.listarAtivos().subscribe({ next: value => this.restaurantes = value, error: () => this.errorMessage = 'Não foi possível carregar os restaurantes.' });
    this.service.listarAtivosSemGerente().subscribe({ next: value => this.restaurantesSemGerente = value, error: () => this.errorMessage = 'Não foi possível carregar os restaurantes sem gerente.' });
  }
  criar(): void {
    if (this.restauranteForm.invalid) return;
    this.service.criar(this.restauranteForm.getRawValue().nome.trim()).subscribe({ next: item => { this.restaurantes = [...this.restaurantes, item]; this.restaurantesSemGerente = [...this.restaurantesSemGerente, item]; this.restauranteForm.reset(); this.successMessage = 'Restaurante criado com sucesso.'; }, error: () => this.errorMessage = 'Não foi possível criar o restaurante.' });
  }
  criarGerente(): void {
    if (this.gerenteForm.invalid) return;
    const value = this.gerenteForm.getRawValue();
    this.service.criarPrimeiroGerente(value.restauranteId, { nome: value.nome.trim(), senha: value.senha }).subscribe({ next: () => { this.restaurantesSemGerente = this.restaurantesSemGerente.filter(item => item.id !== value.restauranteId); this.gerenteForm.reset(); this.successMessage = 'Primeiro gerente criado com sucesso.'; }, error: () => this.errorMessage = 'Não foi possível criar o primeiro gerente.' });
  }
  inativar(id: number): void { this.service.inativar(id).subscribe({ next: () => { this.restaurantes = this.restaurantes.filter(item => item.id !== id); this.restaurantesSemGerente = this.restaurantesSemGerente.filter(item => item.id !== id); this.successMessage = 'Restaurante inativado.'; }, error: () => this.errorMessage = 'Não foi possível inativar o restaurante.' }); }
  abrirSenhaGerente(restaurante: Restaurante): void {
    this.restauranteSenhaId = restaurante.id;
    this.restauranteSenhaNome = restaurante.nome;
    this.senhaGerenteForm.reset();
    this.senhaError = '';
    this.isSenhaModalOpen = true;
  }
  fecharSenhaGerente(): void {
    if (this.isAtualizandoSenha) return;
    this.isSenhaModalOpen = false;
    this.restauranteSenhaId = null;
    this.restauranteSenhaNome = '';
    this.senhaError = '';
    this.senhaGerenteForm.reset();
  }
  salvarSenhaGerente(): void {
    if (!this.podeSalvarSenha || this.restauranteSenhaId === null) {
      this.senhaGerenteForm.markAllAsTouched();
      return;
    }

    const novaSenha = this.senhaGerenteForm.getRawValue().novaSenha;
    this.isAtualizandoSenha = true;
    this.senhaError = '';
    this.service.atualizarSenhaGerente(this.restauranteSenhaId, novaSenha)
      .pipe(finalize(() => (this.isAtualizandoSenha = false)))
      .subscribe({
        next: () => {
          this.isSenhaModalOpen = false;
          this.restauranteSenhaId = null;
          this.restauranteSenhaNome = '';
          this.senhaGerenteForm.reset();
          this.successMessage = 'Senha do gerente atualizada com sucesso!';
        },
        error: (error: HttpErrorResponse) => {
          const body = error.error as { detail?: string; message?: string } | null;
          this.senhaError = body?.detail ?? body?.message ?? 'Não foi possível atualizar a senha do gerente.';
        },
      });
  }
  sair(): void { this.auth.clearToken(); void this.router.navigate(['/login']); }
}
