import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-modal-qrcode-cardapio',
  templateUrl: './modal-qrcode-cardapio.html',
  styleUrl: './modal-qrcode-cardapio.scss',
})
export class ModalQrcodeCardapio implements AfterViewInit {
  @Input({ required: true }) cardapioUrl = '';
  @Output() readonly closed = new EventEmitter<void>();
  @ViewChild('qrCanvas', { static: true }) private readonly canvas!: ElementRef<HTMLCanvasElement>;

  copied = false;
  errorMessage = '';

  ngAfterViewInit(): void {
    void QRCode.toCanvas(this.canvas.nativeElement, this.cardapioUrl, {
      width: 280,
      margin: 2,
      color: { dark: '#2f1644', light: '#ffffff' },
      errorCorrectionLevel: 'H',
    }).catch(() => this.errorMessage = 'Não foi possível gerar o QR Code.');
  }

  async copyLink(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.cardapioUrl);
      this.copied = true;
      window.setTimeout(() => this.copied = false, 2000);
    } catch {
      this.errorMessage = 'Não foi possível copiar o link.';
    }
  }

  download(): void {
    const link = document.createElement('a');
    link.download = 'qrcode-cardapio.png';
    link.href = this.canvas.nativeElement.toDataURL('image/png');
    link.click();
  }
}
