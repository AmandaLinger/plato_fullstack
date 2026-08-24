import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { finalize } from 'rxjs';
import { BtnBack } from '../../components/btn-back/btn-back';
import { FeedbackToast } from '../../components/feedback-toast/feedback-toast';
import { ModalFuncionarioForm } from '../../components/modal-funcionario-form/modal-funcionario-form';
import { CredenciaisFuncionario, Funcionario } from '../../models/configuracoes.models';
import { FuncionariosService } from '../../services/funcionarios.service';

@Component({ selector: 'app-funcionarios-page', imports: [BtnBack, FeedbackToast, ModalFuncionarioForm], templateUrl: './funcionarios-page.html', styleUrl: './funcionarios-page.scss' })
export class FuncionariosPage implements OnInit, OnDestroy {
  private readonly funcionariosService = inject(FuncionariosService);
  funcionarios: readonly Funcionario[] = [];
  funcionarioSelecionado: Funcionario | null = null;
  isModalOpen = false;
  isLoading = true;
  errorMessage = '';
  successMessage = '';
  credenciais: CredenciaisFuncionario | null = null;
  private credentialsTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void { this.loadFuncionarios(); }
  ngOnDestroy(): void { if (this.credentialsTimer) clearTimeout(this.credentialsTimer); }
  openCreateModal(): void { this.funcionarioSelecionado = null; this.isModalOpen = true; }
  openEditModal(funcionario: Funcionario): void { this.funcionarioSelecionado = funcionario; this.isModalOpen = true; }
  closeModal(): void { this.isModalOpen = false; this.funcionarioSelecionado = null; }

  showCredentials(credenciais: CredenciaisFuncionario): void {
    this.credenciais = credenciais;
    if (this.credentialsTimer) clearTimeout(this.credentialsTimer);
    this.credentialsTimer = setTimeout(() => {
      this.credenciais = null;
      this.credentialsTimer = null;
    }, 3000);
  }

  saveFuncionario(funcionario: Funcionario): void {
    const isEditing = this.funcionarioSelecionado !== null;
    this.funcionarios = isEditing
      ? this.funcionarios.map((item) => item.id === funcionario.id ? funcionario : item)
      : [...this.funcionarios, funcionario];
    this.successMessage = isEditing ? 'Funcionário atualizado com sucesso.' : 'Funcionário cadastrado com sucesso.';
    this.errorMessage = '';
    this.closeModal();
  }

  removeFuncionario(id: number): void {
    this.funcionarios = this.funcionarios.filter((item) => item.id !== id);
    this.successMessage = 'Funcionário inativado com sucesso.';
    this.errorMessage = '';
    this.closeModal();
  }

  private loadFuncionarios(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.funcionariosService.listarAtivos().pipe(finalize(() => (this.isLoading = false))).subscribe({
      next: (funcionarios) => (this.funcionarios = funcionarios),
      error: () => { this.funcionarios = []; this.errorMessage = 'Não foi possível carregar os funcionários cadastrados.'; },
    });
  }
}
