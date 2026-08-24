import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {ItemHome} from '../../components/item-home/item-home';
import {BtnConfig} from '../../components/btn-config/btn-config';
import {TelaConfig} from '../../components/tela-config/tela-config';
import { AuthService } from '../../services/auth.service';

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
  readonly auth = inject(AuthService);
  isConfigOpen = false;

  openConfig(): void {
    this.isConfigOpen = true;
  }

  closeConfig(): void {
    this.isConfigOpen = false;
  }

}
