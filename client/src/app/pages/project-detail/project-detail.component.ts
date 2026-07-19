import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { Project } from '../../core/models/models';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="project-detail" *ngIf="project()">
      <!-- Hero -->
      <div class="detail-hero">
        <div class="detail-hero-bg" [class]="'cat-' + project()!.category.replace(' ', '-').toLowerCase()">
          <span class="material-icons-round hero-icon">{{ getCatIcon(project()!.category) }}</span>
        </div>
        <div class="detail-hero-overlay"></div>
        <div class="container detail-hero-content">
          <nav class="breadcrumb">
            <a routerLink="/">Home</a>
            <span class="material-icons-round">chevron_right</span>
            <a routerLink="/projects">Projects</a>
            <span class="material-icons-round">chevron_right</span>
            <span>{{ project()!.title }}</span>
          </nav>
          <h1>{{ project()!.title }}</h1>
          <div class="detail-tags">
            <span class="badge badge-primary">{{ project()!.category }}</span>
            <span class="badge" [class.badge-success]="project()!.status === 'Completed'"
                  [class.badge-warning]="project()!.status === 'Ongoing'"
                  [class.badge-info]="project()!.status === 'Planning'">
              {{ project()!.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- Content -->
      <section class="section-padding">
        <div class="container">
          <div class="detail-grid">
            <div class="detail-main">
              <h2>Project Overview</h2>
              <p>{{ project()!.description }}</p>

              <div *ngIf="project()!.features?.length" class="features-list">
                <h3>Key Features</h3>
                <ul>
                  <li *ngFor="let f of project()!.features">
                    <span class="material-icons-round">check_circle</span>
                    {{ f }}
                  </li>
                </ul>
              </div>
            </div>

            <aside class="detail-sidebar">
              <div class="sidebar-card">
                <h3>Project Info</h3>
                <dl>
                  <div *ngIf="project()!.client"><dt>Client</dt><dd>{{ project()!.client }}</dd></div>
                  <div><dt>Location</dt><dd><span class="material-icons-round">location_on</span>{{ project()!.location }}</dd></div>
                  <div *ngIf="project()!.area"><dt>Area</dt><dd>{{ project()!.area }}</dd></div>
                  <div *ngIf="project()!.budget"><dt>Budget</dt><dd>{{ project()!.budget }}</dd></div>
                  <div *ngIf="project()!.duration"><dt>Duration</dt><dd>{{ project()!.duration }}</dd></div>
                  <div *ngIf="project()!.completionDate"><dt>Completion</dt><dd>{{ project()!.completionDate | date:'MMMM yyyy' }}</dd></div>
                </dl>
                <a routerLink="/contact" class="btn-primary" style="width:100%; justify-content:center; margin-top: 1.5rem;">
                  <span class="material-icons-round">request_quote</span>
                  Get Similar Quote
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>

    <!-- Loading -->
    <div *ngIf="loading()" class="loading-overlay" style="position:relative; height: 60vh;">
      <div class="spinner"></div>
    </div>

    <!-- Not Found -->
    <div *ngIf="!loading() && !project()" class="empty-state section-padding">
      <div class="container" style="text-align:center">
        <span class="material-icons-round" style="font-size:80px;color:rgba(244,180,0,0.2)">search_off</span>
        <h2>Project Not Found</h2>
        <a routerLink="/projects" class="btn-primary" style="margin-top:1.5rem">Back to Projects</a>
      </div>
    </div>
  `,
  styles: [`
    @use '../../../styles/variables' as *;
    .detail-hero { position:relative; height:380px; display:flex; align-items:flex-end; overflow:hidden; }
    .detail-hero-bg { width:100%; height:100%; position:absolute; inset:0; display:flex; align-items:center; justify-content:center; }
    .cat-residential { background: linear-gradient(135deg,#1a1505,#3d2e0a); }
    .cat-commercial { background: linear-gradient(135deg,#051a14,#0a3024); }
    .cat-interior-design { background: linear-gradient(135deg,#0a0518,#1c0840); }
    .cat-renovation { background: linear-gradient(135deg,#1a0a05,#3d1808); }
    .cat-architecture { background: linear-gradient(135deg,#091a05,#163008); }
    .cat-industrial { background: linear-gradient(135deg,#141414,#2e2e2e); }
    .hero-icon { font-size:160px; color:rgba(244,180,0,0.12); }
    .detail-hero-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(28,28,28,1) 0%,rgba(28,28,28,0.5) 60%,transparent 100%); }
    .detail-hero-content { position:relative; z-index:2; padding-bottom:2rem; }
    .detail-hero-content h1 { font-family:'Montserrat',sans-serif; font-size:2.5rem; font-weight:900; color:#fff; margin: 1rem 0 0.75rem; }
    .detail-tags { display:flex; gap:0.5rem; flex-wrap:wrap; }
    .detail-grid { display:grid; grid-template-columns:1fr 320px; gap:3rem; align-items:start; }
    @media(max-width:1024px) { .detail-grid { grid-template-columns:1fr; } }
    .detail-main h2 { font-size:1.75rem; font-weight:700; color:#fff; margin-bottom:1rem; }
    .detail-main p { color:#adb5bd; line-height:1.8; font-size:1rem; }
    .features-list { margin-top:2rem; }
    .features-list h3 { font-size:1.25rem; color:#fff; margin-bottom:1rem; }
    .features-list ul { display:flex; flex-direction:column; gap:0.75rem; list-style:none; }
    .features-list li { display:flex; align-items:center; gap:0.75rem; color:#ced4da; font-size:0.9rem; }
    .features-list .material-icons-round { color:#4CAF50; font-size:18px; }
    .sidebar-card { background:#242424; border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:1.5rem; position:sticky; top:100px; }
    .sidebar-card h3 { font-size:1.1rem; font-weight:700; color:#fff; margin-bottom:1.25rem; padding-bottom:0.75rem; border-bottom:2px solid rgba(244,180,0,0.3); }
    dl div { display:flex; justify-content:space-between; padding:0.75rem 0; border-bottom:1px solid rgba(255,255,255,0.05); gap:1rem; }
    dt { font-size:0.8rem; color:#6C757D; text-transform:uppercase; letter-spacing:0.08em; }
    dd { font-size:0.875rem; color:#e0e0e0; text-align:right; display:flex; align-items:center; gap:4px; }
    dd .material-icons-round { font-size:14px; color:#F4B400; }
    .spinner { width:48px; height:48px; border:4px solid rgba(244,180,0,0.2); border-top-color:#F4B400; border-radius:50%; animation:spin 0.8s linear infinite; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); }
    @keyframes spin { to { transform:translate(-50%,-50%) rotate(360deg); } }
  `]
})
export class ProjectDetailComponent implements OnInit {
  project = signal<Project | null>(null);
  loading = signal(true);

  constructor(private route: ActivatedRoute, private projectService: ProjectService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.projectService.getProject(id).subscribe({
        next: (res) => { 
          this.project.set(res.data || null); 
          this.loading.set(false); 
        },
        error: () => { 
          this.loading.set(false); 
        }
      });
    } else { 
      this.loading.set(false); 
    }
  }

  getCatIcon(cat: string): string {
    const map: Record<string, string> = {
      'Residential':'home_work','Commercial':'business','Interior Design':'design_services',
      'Renovation':'construction','Architecture':'architecture','Industrial':'factory'
    };
    return map[cat] || 'apartment';
  }
}
