import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found">
      <div class="nf-content">
        <div class="nf-crane">
          <span class="material-icons-round">construction</span>
        </div>
        <div class="nf-code">404</div>
        <h1>Page Not Found</h1>
        <p>The page you are looking for doesn't exist or has been moved.<br />Let's get you back on track.</p>
        <div class="nf-actions">
          <a routerLink="/" class="btn-primary">
            <span class="material-icons-round">home</span>
            Back to Home
          </a>
          <a routerLink="/contact" class="btn-outline">
            <span class="material-icons-round">headset_mic</span>
            Contact Us
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @use '../../../styles/variables' as *;
    .not-found { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: radial-gradient(ellipse at center, rgba(244,180,0,0.05) 0%, transparent 60%), #1C1C1C; padding: 2rem; text-align: center; }
    .nf-content { max-width: 560px; animation: slideUp 0.6s ease; }
    .nf-crane { font-size: 80px; color: rgba(244,180,0,0.3); display: block; margin-bottom: 1rem; animation: float 3s ease-in-out infinite;
      .material-icons-round { font-size: 80px; } }
    .nf-code { font-family: 'Bebas Neue', sans-serif; font-size: 8rem; line-height: 1; background: linear-gradient(135deg, #F4B400, #FF6B00); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 1rem; }
    h1 { font-family: 'Montserrat', sans-serif; font-size: 2rem; font-weight: 800; color: #fff; margin-bottom: 1rem; }
    p { color: #6C757D; font-size: 1rem; line-height: 1.8; margin-bottom: 2.5rem; }
    .nf-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
  `]
})
export class NotFoundComponent {}
