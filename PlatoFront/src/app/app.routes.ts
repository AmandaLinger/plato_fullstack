import { Routes } from '@angular/router';
import { InitialPage } from './pages/initial-page/initial-page';
import { LoginPage } from './pages/login-page/login-page';
import {HomePage} from './pages/home-page/home-page';
import {PerfilPage} from './pages/perfil-page/perfil-page';
import {CardapioEditPage} from './pages/cardapio-edit-page/cardapio-edit-page';
import {ConfiguracoesPage} from './pages/configuracoes-page/configuracoes-page';
import { FazerPedidoPage } from './pages/fazer-pedido-page/fazer-pedido-page';
import { FinalizarPedidoPage } from './pages/finalizar-pedido-page/finalizar-pedido-page';
import { ConsultarMesasPage } from './pages/consultar-mesas-page/consultar-mesas-page';
import { NotasDoDiaPage } from './pages/notas-do-dia-page/notas-do-dia-page';
import { FuncionariosPage } from './pages/funcionarios-page/funcionarios-page';
import { FornecedoresPage } from './pages/fornecedores-page/fornecedores-page';
import { MesasPage } from './pages/mesas-page/mesas-page';
import { CozinhaPage } from './pages/cozinha-page/cozinha-page';
import { NotaFornecedorPage } from './pages/nota-fornecedor-page/nota-fornecedor-page';
import { CadastrarRestaurantePage } from './pages/cadastrar-restaurante-page/cadastrar-restaurante-page';

export const routes: Routes = [
  { path: '', component: InitialPage },
  { path: 'home', component: HomePage },
  { path: 'login', component: LoginPage },
  { path: 'cadastrar-restaurante', component: CadastrarRestaurantePage },
  { path: 'perfil', component: PerfilPage },
  { path: 'cardapioEdit', component: CardapioEditPage},
  { path: 'configuracoes', component: ConfiguracoesPage },
  { path: 'fazer-pedido', component: FazerPedidoPage },
  { path: 'finalizar-pedido', component: FinalizarPedidoPage },
  { path: 'consultar-mesas', component: ConsultarMesasPage },
  { path: 'notas-do-dia', component: NotasDoDiaPage },
  { path: 'configuracoes/funcionarios', component: FuncionariosPage },
  { path: 'configuracoes/fornecedores', component: FornecedoresPage },
  { path: 'configuracoes/mesas', component: MesasPage },
  { path: 'configuracoes/cozinha', component: CozinhaPage },
  { path: 'nota-fornecedor', component: NotaFornecedorPage },
  { path: '**', redirectTo: '' }
];
