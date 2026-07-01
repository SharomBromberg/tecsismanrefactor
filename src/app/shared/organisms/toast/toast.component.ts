import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  readonly toast$ = this.toastService.toast$;

  constructor(private readonly toastService: ToastService) {}

  clear(): void {
    this.toastService.clear();
  }
}
