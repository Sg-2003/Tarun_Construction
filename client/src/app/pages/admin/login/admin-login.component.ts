import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-page">
      <div class="login-bg">
        <div class="login-particles">
          @for (p of particles; track $index) {
            <div class="particle" [style]="p"></div>
          }
        </div>
      </div>

      <div class="login-card">
        <div class="login-logo">
          <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" width="56" height="56">
            <rect x="10" y="20" width="40" height="35" rx="2" fill="#F4B400" opacity="0.9"/>
            <rect x="18" y="28" width="8" height="8" rx="1" fill="#1C1C1C"/>
            <rect x="34" y="28" width="8" height="8" rx="1" fill="#1C1C1C"/>
            <rect x="24" y="36" width="12" height="19" rx="1" fill="#1C1C1C"/>
            <rect x="5" y="18" width="50" height="4" rx="2" fill="#FF6B00"/>
            <rect x="28" y="2" width="4" height="18" rx="2" fill="#FF6B00"/>
            <rect x="28" y="2" width="18" height="3" rx="1.5" fill="#FF6B00"/>
          </svg>
          <div>
            <h1>Tarun Construction</h1>
            <p>Admin Dashboard</p>
          </div>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <h2>Sign In</h2>
          <p class="subtitle">Enter your admin credentials to continue</p>

          <div class="form-group" [class.invalid]="f['email'].touched && f['email'].invalid">
            <label>Email Address</label>
            <div class="input-wrap">
              <span class="material-icons-round">email</span>
              <input type="email" formControlName="email" placeholder="admin@tarunconstruction.com" />
            </div>
          </div>

          <div class="form-group" [class.invalid]="f['password'].touched && f['password'].invalid">
            <label>Password</label>
            <div class="input-wrap">
              <span class="material-icons-round">lock</span>
              <input [type]="showPass() ? 'text' : 'password'" formControlName="password" placeholder="••••••••" />
              <button type="button" class="eye-btn" (click)="showPass.update(v=>!v)">
                <span class="material-icons-round">{{ showPass() ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </div>

          @if (error()) {
            <div class="login-error">
              <span class="material-icons-round">error_outline</span>
              {{ error() }}
            </div>
          }

          <button type="submit" class="btn-login" [disabled]="loading()">
            @if (loading()) {
              <span class="spinner-sm"></span> Signing in...
            } @else {
              <span class="material-icons-round">login</span> Sign In
            }
          </button>
        </form>

        <div class="login-hint">
          <span class="material-icons-round">info</span>
          Default: admin&#64;tarunconstruction.com / Admin&#64;123
        </div>
      </div>
    </div>
  `,
  styleUrl: './admin-login.component.scss'
})
export class AdminLoginComponent {
  form: FormGroup;
  loading = signal(false);
  error = signal('');
  showPass = signal(false);

  particles = Array.from({ length: 20 }, (_, i) => ({
    '--size': `${Math.random() * 6 + 2}px`,
    '--x': `${Math.random() * 100}%`,
    '--y': `${Math.random() * 100}%`,
    '--dur': `${Math.random() * 10 + 5}s`,
    '--delay': `${Math.random() * 5}s`,
  })).map(p => Object.entries(p).map(([k, v]) => `${k}:${v}`).join(';'));

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/admin']);
    }
  }

  get f() { return this.form.controls; }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.error.set('');

    const { email, password } = this.form.value;
    this.authService.login(email, password).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';
        this.router.navigate([returnUrl]);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Invalid credentials. Please try again.');
      }
    });
  }
}
