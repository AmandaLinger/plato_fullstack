import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-icon-button',
  templateUrl: './icon-button.html',
  styleUrl: './icon-button.scss',
})
export class IconButton {
  @Input() disabled = false;
  @Input() label = 'Inativar registro';
  @Output() readonly pressed = new EventEmitter<void>();
}
