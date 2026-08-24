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
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { RestaurantesAdminPage } from './pages/restaurantes-admin-page/restaurantes-admin-page';
import { CardapioPublicoPage } from './pages/cardapio-publico-page/cardapio-publico-page';

const gerente = { roles: ['GERENTE'] };
const operacao = { roles: ['GERENTE', 'ATENDENTE', 'CAIXA'] };

export const routes: Routes = [
  { path: '', component: InitialPage, pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  { path: 'cadastrar-restaurante', component: CadastrarRestaurantePage },
  { path: 'cardapio/:restauranteId', component: CardapioPublicoPage },
  {
    path: '',
    canActivateChild: [authGuard],
    children: [
      { path: 'admin/restaurantes', component: RestaurantesAdminPage, canActivate: [roleGuard], data: { roles: ['ROOT'] } },
      { path: 'home', component: HomePage, canActivate: [roleGuard], data: operacao },
      { path: 'perfil', component: PerfilPage, canActivate: [roleGuard], data: { roles: ['ROOT', 'GERENTE', 'ATENDENTE', 'CAIXA'] } },
      { path: 'cardapioEdit', component: CardapioEditPage, canActivate: [roleGuard], data: gerente },
      { path: 'configuracoes', component: ConfiguracoesPage, canActivate: [roleGuard], data: gerente },
      { path: 'fazer-pedido', component: FazerPedidoPage, canActivate: [roleGuard], data: operacao },
      { path: 'finalizar-pedido', component: FinalizarPedidoPage, canActivate: [roleGuard], data: operacao },
      { path: 'consultar-mesas', component: ConsultarMesasPage, canActivate: [roleGuard], data: operacao },
      { path: 'notas-do-dia', component: NotasDoDiaPage, canActivate: [roleGuard], data: { roles: ['GERENTE', 'CAIXA'] } },
      { path: 'configuracoes/funcionarios', component: FuncionariosPage, canActivate: [roleGuard], data: gerente },
      { path: 'configuracoes/fornecedores', component: FornecedoresPage, canActivate: [roleGuard], data: gerente },
      { path: 'configuracoes/mesas', component: MesasPage, canActivate: [roleGuard], data: gerente },
      { path: 'configuracoes/cozinha', component: CozinhaPage, canActivate: [roleGuard], data: { roles: ['GERENTE', 'ATENDENTE'] } },
      { path: 'cozinha', component: CozinhaPage, canActivate: [roleGuard], data: { roles: ['GERENTE', 'ATENDENTE'] } },
      { path: 'nota-fornecedor', component: NotaFornecedorPage, canActivate: [roleGuard], data: gerente },
    ],
  },
  { path: '**', redirectTo: '' }
];
