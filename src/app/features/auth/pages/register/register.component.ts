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
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loading = false;
  errorMessage = '';

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
    });

    this.loading = false;

    if (!result.ok) {
      this.errorMessage = result.message ?? 'No fue posible crear la cuenta.';
      return;
    }

    const loginOk = this.authService.login(
      payload.username ?? '',
      payload.password ?? '',
    );
    if (!loginOk) {
      void this.router.navigate(['/login']);
      return;
    }

    void this.router.navigate(['/user']);
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
