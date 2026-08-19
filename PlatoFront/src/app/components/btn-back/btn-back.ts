import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-btn-back',
  templateUrl: './btn-back.html',
  styleUrl: './btn-back.scss',
})
export class BtnBack {
  private readonly location = inject(Location);
  private readonly router = inject(Router);

  goBack(): void {
    const navigationId = window.history.state?.navigationId;

    if (window.history.length > 1 && typeof navigationId === 'number' && navigationId > 1) {
      this.location.back();
      return;
    }

    void this.router.navigate(['/home']);
  }
}
