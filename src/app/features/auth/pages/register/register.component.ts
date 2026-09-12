import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '@shared/atoms/button/button.component';
import { InputComponent } from '@shared/atoms/input/input.component';
import { AuthService } from '@core/services/auth.service';
import { AccountVerificationChallenge } from '@core/interfaces/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonComponent,
    InputComponent,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loading = false;
  errorMessage = '';
  verification: AccountVerificationChallenge | null = null;
  verifyError = '';

  private pendingPassword = '';

  private readonly usernamePattern = /^[a-z0-9._-]{3,24}$/;
  private readonly strongPasswordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  readonly form = this.fb.group(
    {
      displayName: ['', [Validators.required, Validators.minLength(2)]],
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(this.usernamePattern),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(this.strongPasswordPattern),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordsMatchValidator },
  );

  readonly verifyForm = this.fb.group({
    code: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
    ],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const payload = this.form.getRawValue();
    const result = this.authService.registerUser({
      displayName: payload.displayName ?? '',
      username: payload.username ?? '',
      password: payload.password ?? '',
      email: payload.email ?? '',
    });

    this.loading = false;

    if (!result.ok) {
      this.errorMessage = result.message;
      return;
    }

    this.pendingPassword = payload.password ?? '';
    this.verification = result.verification;
    this.verifyForm.reset();
  }

  submitVerification(): void {
    if (this.verifyForm.invalid) {
      this.verifyForm.markAllAsTouched();
      return;
    }

    this.verifyError = '';
    const code = this.verifyForm.getRawValue().code ?? '';
    const result = this.authService.confirmEmailVerification(code);

    if (!result.ok) {
      this.verifyError = result.message ?? 'Código incorrecto.';
      return;
    }

    const username = this.verification?.username ?? '';
    this.verification = null;

    const loginResult = this.authService.login(username, this.pendingPassword);
    if (loginResult.status !== 'success') {
      void this.router.navigate(['/login']);
      return;
    }

    void this.router.navigate(['/user']);
  }

  cancelVerification(): void {
    this.authService.cancelVerification();
    this.verification = null;
    this.verifyError = '';
  }

  private passwordsMatchValidator(
    control: AbstractControl,
  ): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { passwordMismatch: true };
  }
}
