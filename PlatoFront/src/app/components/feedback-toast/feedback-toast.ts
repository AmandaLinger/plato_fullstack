import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';

export type FeedbackToastType = 'success' | 'error';

@Component({
  selector: 'app-feedback-toast',
  templateUrl: './feedback-toast.html',
  styleUrl: './feedback-toast.scss',
})
export class FeedbackToast implements OnChanges, OnDestroy {
  @Input({ required: true }) type: FeedbackToastType = 'success';
  @Input({ required: true }) message = '';
  @Output() readonly dismissed = new EventEmitter<void>();

  isLeaving = false;
  private exitTimer: ReturnType<typeof setTimeout> | undefined;
  private dismissTimer: ReturnType<typeof setTimeout> | undefined;

  get ariaRole(): 'status' | 'alert' {
    return this.type === 'success' ? 'status' : 'alert';
  }

  ngOnChanges(): void {
    this.restartTimers();
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  private restartTimers(): void {
    this.clearTimers();
    this.isLeaving = false;

    if (!this.message) {
      return;
    }

    this.exitTimer = setTimeout(() => (this.isLeaving = true), 1700);
    this.dismissTimer = setTimeout(() => {
      this.dismissed.emit();
      this.clearTimers();
    }, 2000);
  }

  private clearTimers(): void {
    if (this.exitTimer !== undefined) {
      clearTimeout(this.exitTimer);
      this.exitTimer = undefined;
    }
    if (this.dismissTimer !== undefined) {
      clearTimeout(this.dismissTimer);
      this.dismissTimer = undefined;
    }
  }
}
