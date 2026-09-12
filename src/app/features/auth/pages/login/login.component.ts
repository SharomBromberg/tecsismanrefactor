import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '@shared/atoms/button/button.component';
import { InputComponent } from '@shared/atoms/input/input.component';
import { AuthService } from '@core/services/auth.service';
import { AccountVerificationChallenge, TwoFactorChallengeInfo } from '@core/interfaces/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonComponent,
    InputComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  errorMessage = '';
  loading = false;
  twoFactorChallenge: TwoFactorChallengeInfo | null = null;
  twoFactorError = '';
  verificationChallenge: AccountVerificationChallenge | null = null;
  verifyError = '';

  private unverifiedUsername = '';
  private unverifiedPassword = '';

  readonly form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  readonly twoFactorForm = this.fb.group({
    code: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
    ],
  });

  readonly verifyForm = this.fb.group({
    code: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
    ],
  });

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.redirectByRole(this.authService.currentSession()?.role);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { username, password } = this.form.getRawValue();
    const result = this.authService.login(username ?? '', password ?? '');

    this.loading = false;

    if (result.status === 'error') {
      this.errorMessage = result.message;
      return;
    }

    if (result.status === 'two-factor-required') {
      this.twoFactorChallenge = result.challenge;
      this.twoFactorForm.reset();
      return;
    }

    if (result.status === 'unverified') {
      this.unverifiedUsername = username ?? '';
      this.unverifiedPassword = password ?? '';
      const resend = this.authService.resendVerification(
        this.unverifiedUsername,
        this.unverifiedPassword,
      );

      if (resend.ok && resend.verification) {
        this.verificationChallenge = resend.verification;
        this.verifyForm.reset();
      } else {
        this.errorMessage =
          resend.message ?? 'Tu cuenta aún no ha sido verificada.';
      }
      return;
    }

    this.completeLogin();
  }

  submitAccountVerification(): void {
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

    this.verificationChallenge = null;
    const loginResult = this.authService.login(
      this.unverifiedUsername,
      this.unverifiedPassword,
    );

    if (loginResult.status === 'two-factor-required') {
      this.twoFactorChallenge = loginResult.challenge;
      this.twoFactorForm.reset();
      return;
    }

    if (loginResult.status === 'error') {
      this.errorMessage = loginResult.message;
      return;
    }

    if (loginResult.status === 'success') {
      this.completeLogin();
    }
  }

  cancelAccountVerification(): void {
    this.authService.cancelVerification();
    this.verificationChallenge = null;
    this.verifyError = '';
    this.form.reset();
  }

  submitTwoFactor(): void {
    if (this.twoFactorForm.invalid) {
      this.twoFactorForm.markAllAsTouched();
      return;
    }

    this.twoFactorError = '';
    const code = this.twoFactorForm.getRawValue().code ?? '';
    const result = this.authService.confirmTwoFactor(code);

    if (!result.ok) {
      this.twoFactorError = result.message ?? 'Código incorrecto.';
      return;
    }

    this.twoFactorChallenge = null;
    this.completeLogin();
  }

  cancelTwoFactor(): void {
    this.authService.cancelTwoFactor();
    this.twoFactorChallenge = null;
    this.twoFactorError = '';
    this.form.reset();
  }

  private completeLogin(): void {
    const redirectTo = this.route.snapshot.queryParamMap.get('redirectTo');
    if (redirectTo && !redirectTo.includes('/login')) {
      void this.router.navigateByUrl(redirectTo);
      return;
    }

    this.redirectByRole(this.authService.currentSession()?.role);
  }

  private redirectByRole(role: string | undefined): void {
    const target = role === 'user' ? '/cuenta' : '/admin';
    void this.router.navigate([target]);
  }
}
