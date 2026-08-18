import { Component, EventEmitter, Output } from '@angular/core';
import {ItemHome} from '../item-home/item-home';
import {RouterLink} from '@angular/router';

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
  @Output() readonly closed = new EventEmitter<void>();

  close(): void {
    this.closed.emit();
  }
}
