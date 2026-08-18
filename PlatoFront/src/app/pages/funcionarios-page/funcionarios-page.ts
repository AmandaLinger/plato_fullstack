import { Component, OnInit, inject } from '@angular/core';
import { finalize } from 'rxjs';
import { BtnBack } from '../../components/btn-back/btn-back';
import { ModalFuncionarioForm } from '../../components/modal-funcionario-form/modal-funcionario-form';
import { Funcionario } from '../../models/configuracoes.models';
import { FuncionariosService } from '../../services/funcionarios.service';

@Component({ selector: 'app-funcionarios-page', imports: [BtnBack, ModalFuncionarioForm], templateUrl: './funcionarios-page.html', styleUrl: './funcionarios-page.scss' })
export class FuncionariosPage implements OnInit {
  private readonly funcionariosService = inject(FuncionariosService);

  funcionarios: readonly Funcionario[] = [];
  isModalOpen = false;
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadFuncionarios();
  }

  loadFuncionarios(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.funcionariosService
      .listarAtivos()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (funcionarios) => (this.funcionarios = funcionarios),
        error: () => {
          this.funcionarios = [];
          this.errorMessage = 'Não foi possível carregar os funcionários cadastrados.';
        },
      });
  }

  addFuncionario(funcionario: Funcionario): void {
    this.funcionarios = [...this.funcionarios, funcionario];
    this.isModalOpen = false;
  }
}
