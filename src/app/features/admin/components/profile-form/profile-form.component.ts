import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserRole } from '@core/interfaces/auth';

@Component({
  selector: 'app-admin-profile-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
})
export class ProfileFormComponent implements OnChanges {
  @Input() username = '';
  @Input() displayName = '';
  @Input() role: UserRole = 'admin';
  @Input() profileFeedback = '';
  @Input() passwordFeedback = '';

  @Output() saveDisplayName = new EventEmitter<string>();
  @Output() changePassword = new EventEmitter<{
    currentPassword: string;
    nextPassword: string;
  }>();

  private readonly fb = new FormBuilder();

  readonly profileForm = this.fb.group({
    displayName: ['', [Validators.required, Validators.minLength(3)]],
  });

  readonly passwordForm = this.fb.group({
    currentPassword: ['', [Validators.required]],
    nextPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if ('displayName' in changes) {
      this.profileForm.patchValue({ displayName: this.displayName }, { emitEvent: false });
    }
  }

  submitProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.saveDisplayName.emit(this.profileForm.getRawValue().displayName?.trim() ?? '');
  }

  submitPassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const raw = this.passwordForm.getRawValue();
    this.changePassword.emit({
      currentPassword: raw.currentPassword ?? '',
      nextPassword: raw.nextPassword ?? '',
    });
    this.passwordForm.reset();
  }
}