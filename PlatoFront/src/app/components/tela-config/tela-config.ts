import { Component, EventEmitter, Output, inject } from '@angular/core';
import {ItemHome} from '../item-home/item-home';
import {RouterLink} from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tela-config',
  imports: [
    ItemHome,
    RouterLink
  ],
  templateUrl: './tela-config.html',
  styleUrl: './tela-config.scss',
})
export class TelaConfig {
  readonly auth = inject(AuthService);
  @Output() readonly closed = new EventEmitter<void>();

  close(): void {
    this.closed.emit();
  }
}
