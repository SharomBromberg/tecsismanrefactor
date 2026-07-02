import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
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

  readonly form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      const current = this.authService.currentSession();
      if (current?.role === 'admin') {
        void this.router.navigate(['/admin']);
      }
      if (current?.role === 'user') {
        void this.router.navigate(['/user']);
      }
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
    const success = this.authService.login(username ?? '', password ?? '');

    this.loading = false;

    if (!success) {
      this.errorMessage = this.authService.getLastAuthError();
      return;
    }

    const redirectTo = this.route.snapshot.queryParamMap.get('redirectTo');
    if (redirectTo) {
      void this.router.navigateByUrl(redirectTo);
      return;
    }

    const current = this.authService.currentSession();
    void this.router.navigate([current?.role === 'admin' ? '/admin' : '/user']);
  }
}
