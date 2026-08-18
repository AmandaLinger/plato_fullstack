import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {ItemHome} from '../../components/item-home/item-home';
import {BtnConfig} from '../../components/btn-config/btn-config';
import {TelaConfig} from '../../components/tela-config/tela-config';

@Component({
  selector: 'app-home-page',
  imports: [
    ItemHome,
    RouterLink,
    BtnConfig,
    TelaConfig
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  isConfigOpen = false;

  openConfig(): void {
    this.isConfigOpen = true;
  }

  closeConfig(): void {
    this.isConfigOpen = false;
  }

}
