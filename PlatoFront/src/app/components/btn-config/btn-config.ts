import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-btn-config',
  imports: [],
  templateUrl: './btn-config.html',
  styleUrl: './btn-config.scss',
})
export class BtnConfig {
  @Output() readonly configClick = new EventEmitter<void>();

  openConfig(): void {
    this.configClick.emit();
  }
}
