import { Component, inject, signal, PLATFORM_ID, Inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { filter } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    @if (!isAdminRoute()) {
      <app-navbar></app-navbar>
    }
    <main>
      <router-outlet></router-outlet>
    </main>
    @if (!isAdminRoute()) {
      <app-footer></app-footer>
      <a href="https://wa.me/919876543210?text=Hello%2C%20I%27m%20interested%20in%20your%20construction%20services"
         target="_blank" class="whatsapp-float" aria-label="Chat on WhatsApp">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="32" height="32">
          <path fill="#fff" d="M4.868,43.303l2.694-9.835C5.9,31.062,5,28.166,5,25.259C5,13.57,14.573,4,26.26,4C31.938,4,37.292,6.175,41.322,10.201c4.028,4.026,6.197,9.382,6.194,15.068c-0.004,11.69-9.577,21.262-21.262,21.262c-2.734,0-5.414-0.548-7.898-1.583L4.868,43.303z"/>
          <path fill="#25D366" d="M26.258,4.029c-11.682,0-21.258,9.572-21.262,21.257c-0.001,3.906,1.012,7.587,2.876,10.803L5.133,45.66l9.799-2.575c3.102,1.691,6.598,2.587,10.159,2.587h0.009c11.682,0,21.258-9.572,21.262-21.257c0.002-5.678-2.201-11.015-6.226-15.043C36.106,5.399,30.772,3.031,26.258,4.029z M26.258,41.015h-0.008c-3.204,0-6.347-0.862-9.094-2.492l-0.652-0.387l-6.764,1.774l1.806-6.599l-0.425-0.677c-1.795-2.853-2.744-6.146-2.742-9.523c0.004-9.877,8.042-17.913,17.923-17.913c4.786,0,9.279,1.866,12.658,5.251c3.38,3.386,5.241,7.882,5.239,12.667C44.17,33,36.131,41.015,26.258,41.015z"/>
          <path fill="#25D366" d="M35.176,28.503c-0.478-0.238-2.822-1.393-3.259-1.553c-0.436-0.159-0.753-0.238-1.071,0.239c-0.315,0.474-1.23,1.553-1.509,1.871c-0.277,0.315-0.556,0.357-1.033,0.119c-0.477-0.239-2.014-0.742-3.833-2.366c-1.416-1.265-2.372-2.828-2.651-3.305c-0.277-0.477-0.03-0.735,0.209-0.973c0.213-0.213,0.477-0.556,0.716-0.834c0.239-0.278,0.318-0.477,0.477-0.795c0.16-0.317,0.08-0.596-0.04-0.835c-0.119-0.238-1.071-2.582-1.468-3.535c-0.387-0.927-0.781-0.803-1.071-0.817l-0.911-0.016c-0.317,0-0.834,0.119-1.269,0.596c-0.437,0.477-1.665,1.624-1.665,3.965c0,2.341,1.705,4.604,1.943,4.921c0.239,0.317,3.357,5.126,8.13,7.188c1.136,0.49,2.022,0.783,2.713,1.004c1.14,0.361,2.178,0.31,2.998,0.188c0.916-0.137,2.822-1.153,3.22-2.267c0.399-1.114,0.399-2.069,0.279-2.267C35.932,28.74,35.651,28.741,35.176,28.503z"/>
        </svg>
      </a>
    }
  `,
  styles: [`
    main { min-height: 100vh; }
  `]
})
export class AppComponent {
  private router = inject(Router);
  isAdminRoute = signal(false);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isAdminRoute.set(event.urlAfterRedirects.startsWith('/admin'));

      if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => this.initScrollReveal(), 200);
      }
    });
  }

  private initScrollReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.05 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }
}
