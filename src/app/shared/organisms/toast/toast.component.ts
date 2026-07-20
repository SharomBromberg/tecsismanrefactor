import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  private readonly toastService = inject(ToastService);
  readonly toast$ = this.toastService.toast$;

  clear(): void {
    this.toastService.clear();
  }
}
