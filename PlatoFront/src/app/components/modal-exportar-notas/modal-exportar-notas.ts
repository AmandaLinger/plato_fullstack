import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

export interface PeriodoRelatorio {
  readonly inicio: string;
  readonly fim: string;
}

@Component({
  selector: 'app-modal-exportar-notas',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-exportar-notas.html',
  styleUrl: './modal-exportar-notas.scss',
})
export class ModalExportarNotas {
  @Input() eyebrow = 'Relatório financeiro';
  @Input() title = 'Exportar notas fiscais';
  @Input() description = 'Selecione o período das notas que deseja incluir no relatório.';
  @Input() isDownloading = false;
  @Input() errorMessage = '';
  @Output() readonly closed = new EventEmitter<void>();
  @Output() readonly download = new EventEmitter<PeriodoRelatorio>();

  private readonly formBuilder = inject(FormBuilder);
  private readonly today = this.formatDate(new Date());

  readonly form = this.formBuilder.nonNullable.group({
    inicio: [this.today, Validators.required],
    fim: [this.today, Validators.required],
  });

  get hasInvalidPeriod(): boolean {
    const { inicio, fim } = this.form.getRawValue();
    return Boolean(inicio && fim && fim < inicio);
  }

  submit(): void {
    if (this.form.invalid || this.hasInvalidPeriod || this.isDownloading) {
      this.form.markAllAsTouched();
      return;
    }

    this.download.emit(this.form.getRawValue());
  }

  close(): void {
    if (!this.isDownloading) {
      this.closed.emit();
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
