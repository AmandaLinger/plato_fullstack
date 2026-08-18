import { Component } from '@angular/core';
import { ItemHome } from '../../components/item-home/item-home';
import {BtnBack} from '../../components/btn-back/btn-back';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-configuracoes-page',
  imports: [ItemHome, BtnBack, RouterLink],
  templateUrl: './configuracoes-page.html',
  styleUrl: './configuracoes-page.scss',
})
export class ConfiguracoesPage {}
