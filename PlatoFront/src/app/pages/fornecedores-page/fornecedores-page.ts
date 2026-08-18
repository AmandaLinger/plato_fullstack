import { Component } from '@angular/core';
import { BtnBack } from '../../components/btn-back/btn-back';
import { ModalFornecedorForm } from '../../components/modal-fornecedor-form/modal-fornecedor-form';
import { Fornecedor, FornecedorCadastro } from '../../models/configuracoes.models';

@Component({ selector: 'app-fornecedores-page', imports: [BtnBack, ModalFornecedorForm], templateUrl: './fornecedores-page.html', styleUrl: './fornecedores-page.scss' })
export class FornecedoresPage {
  fornecedores: Fornecedor[] = [
    { id: 1, nome: 'Distribuidora Central', cnpj: '12.345.678/0001-90' },
    { id: 2, nome: 'Bebidas da Casa', cnpj: '' },
  ];
  isModalOpen = false;

  addFornecedor(fornecedor: FornecedorCadastro): void {
    this.fornecedores = [...this.fornecedores, { ...fornecedor, id: Date.now() }];
    this.isModalOpen = false;
  }
}
