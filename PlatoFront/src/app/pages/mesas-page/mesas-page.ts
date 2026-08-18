import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BtnBack } from '../../components/btn-back/btn-back';
import { MesasService } from '../../services/mesas.service';

@Component({ selector: 'app-mesas-page', imports: [ReactiveFormsModule, BtnBack], templateUrl: './mesas-page.html', styleUrl: './mesas-page.scss' })
export class MesasPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly mesasService = inject(MesasService);
  readonly form = this.formBuilder.nonNullable.group({ totalMesas: [this.mesasService.getTotalMesas(), [Validators.required, Validators.min(1), Validators.pattern('^[0-9]+$')]] });
  totalMesas = this.mesasService.getTotalMesas();
  saved = false;

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.totalMesas = Number(this.form.controls.totalMesas.value);
    this.mesasService.setTotalMesas(this.totalMesas);
    this.saved = true;
  }
}
