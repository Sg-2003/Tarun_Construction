import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="admin-layout">
      <!-- Sidebar -->
      <aside class="admin-sidebar" [class.collapsed]="sidebarCollapsed">
        <div class="sidebar-header">
          <div class="sidebar-logo" *ngIf="!sidebarCollapsed">
            <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
              <rect x="10" y="20" width="40" height="35" rx="2" fill="#F4B400" opacity="0.9"/>
              <rect x="5" y="18" width="50" height="4" rx="2" fill="#FF6B00"/>
              <rect x="28" y="2" width="4" height="18" rx="2" fill="#FF6B00"/>
            </svg>
            <div>
              <span class="logo-name">Tarun</span>
              <span class="logo-sub">Admin Panel</span>
            </div>
          </div>
          <button class="collapse-btn" (click)="sidebarCollapsed = !sidebarCollapsed">
            <span class="material-icons-round">{{ sidebarCollapsed ? 'menu_open' : 'menu' }}</span>
          </button>
        </div>

        <nav class="sidebar-nav">
          @for (item of navItems; track item.path) {
            <a [routerLink]="item.path" routerLinkActive="active" class="nav-item" [title]="item.label">
              <span class="material-icons-round">{{ item.icon }}</span>
              <span class="nav-label" *ngIf="!sidebarCollapsed">{{ item.label }}</span>
            </a>
          }
        </nav>

        <div class="sidebar-footer">
          <div class="user-info" *ngIf="!sidebarCollapsed">
            <div class="user-avatar">
              {{ (user?.name || 'A').charAt(0).toUpperCase() }}
            </div>
            <div>
              <strong>{{ user?.name }}</strong>
              <span>{{ user?.role }}</span>
            </div>
          </div>
          <button class="logout-btn" (click)="logout()" [title]="'Logout'">
            <span class="material-icons-round">logout</span>
            <span *ngIf="!sidebarCollapsed">Logout</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="admin-main">
        <div class="admin-topbar">
          <div class="topbar-left">
            <span class="page-title">Admin Dashboard</span>
          </div>
          <div class="topbar-right">
            <a routerLink="/" target="_blank" class="view-site-btn">
              <span class="material-icons-round">open_in_new</span>
              View Site
            </a>
          </div>
        </div>
        <div class="admin-content">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
  sidebarCollapsed = false;
  user: any = null;

  navItems = [
    { icon: 'dashboard', label: 'Overview', path: '/admin/overview' },
    { icon: 'apartment', label: 'Projects', path: '/admin/projects' },
    { icon: 'mail', label: 'Enquiries', path: '/admin/enquiries' },
  ];

  constructor(private authService: AuthService, private router: Router) {
    this.user = this.authService.getCurrentUser();
  }

  logout() {
    this.authService.logout();
  }
}
