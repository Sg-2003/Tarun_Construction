import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EnquiryService } from '../../../core/services/enquiry.service';
import { ProjectService } from '../../../core/services/project.service';
import { DashboardStats } from '../../../core/models/models';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="overview">
      <h2 class="page-heading">Dashboard Overview</h2>

      <!-- Stats Cards -->
      <div class="stats-cards">
        @for (card of statCards(); track card.label) {
          <div class="stat-card" [style.border-color]="card.color + '33'">
            <div class="sc-icon" [style.background]="card.color + '15'" [style.color]="card.color">
              <span class="material-icons-round">{{ card.icon }}</span>
            </div>
            <div class="sc-data">
              <div class="sc-value">{{ card.value }}</div>
              <div class="sc-label">{{ card.label }}</div>
            </div>
            <div class="sc-trend" [style.color]="card.color">
              <span class="material-icons-round">trending_up</span>
            </div>
          </div>
        }
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h3>Quick Actions</h3>
        <div class="action-grid">
          <a routerLink="/admin/projects" class="action-card">
            <span class="material-icons-round">add_circle</span>
            <span>Add Project</span>
          </a>
          <a routerLink="/admin/enquiries" class="action-card">
            <span class="material-icons-round">mail</span>
            <span>View Enquiries</span>
            @if (unreadCount() > 0) {
              <div class="badge-count">{{ unreadCount() }}</div>
            }
          </a>
          <a routerLink="/" target="_blank" class="action-card">
            <span class="material-icons-round">visibility</span>
            <span>View Website</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @use '../../../../styles/variables' as *;
    .overview { max-width: 1100px; }
    .page-heading { font-family: 'Montserrat', sans-serif; font-size: 1.75rem; font-weight: 800; color: #fff; margin-bottom: 2rem; }
    .stats-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 2.5rem;
      @media(max-width:900px) { grid-template-columns: repeat(2, 1fr); }
      @media(max-width:500px) { grid-template-columns: 1fr; }
    }
    .stat-card { background: #242424; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 1.5rem; display: flex; align-items: center; gap: 1rem; transition: all 0.3s ease; }
    .stat-card:hover { transform: translateY(-4px); box-shadow: 0 10px 30px rgba(0,0,0,0.4); }
    .sc-icon { width: 52px; height: 52px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      .material-icons-round { font-size: 26px; }
    }
    .sc-value { font-family: 'Montserrat', sans-serif; font-size: 2rem; font-weight: 900; color: #fff; }
    .sc-label { font-size: 0.8rem; color: #6C757D; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 2px; }
    .sc-trend { margin-left: auto; .material-icons-round { font-size: 24px; } }
    .quick-actions h3 { font-family: 'Montserrat', sans-serif; font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: 1rem; }
    .action-grid { display: flex; gap: 1rem; flex-wrap: wrap; }
    .action-card { display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.5rem; background: rgba(244,180,0,0.08); border: 1px solid rgba(244,180,0,0.2); border-radius: 12px; color: #F4B400; font-size: 0.875rem; font-weight: 600; text-decoration: none; transition: all 0.3s ease; position: relative;
      .material-icons-round { font-size: 22px; }
      &:hover { background: rgba(244,180,0,0.15); transform: translateY(-2px); }
    }
    .badge-count { position: absolute; top: -8px; right: -8px; min-width: 22px; height: 22px; background: #F44336; border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; color: #fff; padding: 0 4px; }
  `]
})
export class OverviewComponent implements OnInit {
  stats = signal<DashboardStats | null>(null);
  unreadCount = signal(0);

  statCards = signal<any[]>([
    { icon: 'apartment', label: 'Total Projects', value: '—', color: '#F4B400' },
    { icon: 'check_circle', label: 'Completed', value: '—', color: '#4CAF50' },
    { icon: 'construction', label: 'Ongoing', value: '—', color: '#FF6B00' },
    { icon: 'mail', label: 'Total Enquiries', value: '—', color: '#2196F3' },
    { icon: 'mark_email_unread', label: 'New Enquiries', value: '—', color: '#FF6B00' },
    { icon: 'notifications_active', label: 'Unread', value: '—', color: '#F44336' },
  ]);

  constructor(private enquiryService: EnquiryService) {}

  ngOnInit() {
    this.enquiryService.getStats().subscribe({
      next: (res) => {
        if (res.data) {
          const s = res.data;
          this.unreadCount.set(s.unreadEnquiries);
          this.statCards.set([
            { icon: 'apartment', label: 'Total Projects', value: s.totalProjects, color: '#F4B400' },
            { icon: 'check_circle', label: 'Completed', value: s.completedProjects, color: '#4CAF50' },
            { icon: 'construction', label: 'Ongoing', value: s.ongoingProjects, color: '#FF6B00' },
            { icon: 'mail', label: 'Total Enquiries', value: s.totalEnquiries, color: '#2196F3' },
            { icon: 'mark_email_unread', label: 'New Enquiries', value: s.newEnquiries, color: '#FF6B00' },
            { icon: 'notifications_active', label: 'Unread', value: s.unreadEnquiries, color: '#F44336' },
          ]);
        }
      },
      error: () => {}
    });
  }
}
