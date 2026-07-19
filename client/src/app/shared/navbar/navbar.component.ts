import { Component, HostListener, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

interface NavLink {
  label: string;
  path: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar" [class.scrolled]="isScrolled()" [class.menu-open]="menuOpen()">
      <div class="navbar-container">
        <!-- Logo -->
        <a routerLink="/" class="navbar-logo" (click)="closeMenu()">
          <div class="logo-icon">
            <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="20" width="40" height="35" rx="2" fill="#F4B400" opacity="0.9"/>
              <rect x="18" y="28" width="8" height="8" rx="1" fill="#1C1C1C"/>
              <rect x="34" y="28" width="8" height="8" rx="1" fill="#1C1C1C"/>
              <rect x="24" y="36" width="12" height="19" rx="1" fill="#1C1C1C"/>
              <rect x="5" y="18" width="50" height="4" rx="2" fill="#FF6B00"/>
              <rect x="28" y="2" width="4" height="18" rx="2" fill="#FF6B00"/>
              <rect x="28" y="2" width="18" height="3" rx="1.5" fill="#FF6B00"/>
              <circle cx="46" cy="5" r="2" fill="#F4B400"/>
            </svg>
          </div>
          <div class="logo-text">
            <span class="logo-name">Tarun</span>
            <span class="logo-sub">Construction</span>
          </div>
        </a>

        <!-- Desktop Nav Links -->
        <ul class="navbar-links">
          @for (link of navLinks; track link.path) {
            <li>
              <a [routerLink]="link.path" routerLinkActive="active"
                 [routerLinkActiveOptions]="{ exact: link.path === '/' }">
                {{ link.label }}
              </a>
            </li>
          }
        </ul>

        <!-- CTA + Theme -->
        <div class="navbar-actions">
          <a routerLink="/contact" class="btn-get-quote">
            Get a Quote
          </a>
          <button class="hamburger" [class.open]="menuOpen()" (click)="toggleMenu()" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div class="mobile-menu" [class.open]="menuOpen()">
        <ul>
          @for (link of navLinks; track link.path) {
            <li>
              <a [routerLink]="link.path" routerLinkActive="active"
                 [routerLinkActiveOptions]="{ exact: link.path === '/' }"
                 (click)="closeMenu()">
                {{ link.label }}
              </a>
            </li>
          }
          <li>
            <a routerLink="/contact" class="mobile-cta" (click)="closeMenu()">Get a Quote</a>
          </li>
        </ul>
      </div>
    </nav>
  `,
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  isScrolled = signal(false);
  menuOpen = signal(false);

  navLinks: NavLink[] = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Projects', path: '/projects' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Testimonials', path: '/testimonials' },
    { label: 'Contact', path: '/contact' },
  ];

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled.set(window.scrollY > 60);
  }

  ngOnInit() {
    this.isScrolled.set(window.scrollY > 60);
  }

  toggleMenu() {
    this.menuOpen.update(v => !v);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }
}
