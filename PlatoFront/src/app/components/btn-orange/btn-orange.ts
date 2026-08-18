import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-btn-orange',
  templateUrl: './btn-orange.html',
  styleUrl: './btn-orange.scss',
})
export class BtnOrange {
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' = 'button';
  @Input() fontSize: string = 'var(--ts-24)';
}
