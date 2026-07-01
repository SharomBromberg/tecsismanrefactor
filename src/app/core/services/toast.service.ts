import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'info' | 'error';

export interface ToastState {
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly toastSubject = new BehaviorSubject<ToastState | null>(null);
  readonly toast$ = this.toastSubject.asObservable();

  private hideTimer: ReturnType<typeof setTimeout> | null = null;

  show(message: string, type: ToastType = 'success', durationMs = 2400): void {
    this.toastSubject.next({ message, type });

    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
    }

    this.hideTimer = setTimeout(() => {
      this.clear();
    }, durationMs);
  }

  clear(): void {
    this.toastSubject.next(null);
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
  }
}
