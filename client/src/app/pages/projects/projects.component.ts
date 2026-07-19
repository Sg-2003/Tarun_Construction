import { Component, OnInit, AfterViewInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { Project, ProjectCategory } from '../../core/models/models';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit, AfterViewInit {
  projects = signal<Project[]>([]);
  selectedCategory = signal<ProjectCategory>('All');
  loading = signal(true);
  error = signal('');

  filteredProjects = computed(() => {
    const cat = this.selectedCategory();
    const list = this.projects();
    if (cat === 'All') {
      return list;
    } else {
      return list.filter(p => p.category === cat);
    }
  });

  categories: ProjectCategory[] = [
    'All', 'Residential', 'Commercial', 'Interior Design',
    'Renovation', 'Architecture', 'Industrial'
  ];

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.loadProjects();
  }

  ngAfterViewInit() {
    this.initScrollReveal();
  }

  loadProjects() {
    this.loading.set(true);
    this.projectService.getProjects({ limit: 50 }).subscribe({
      next: (res) => {
        this.projects.set(res.data);
        this.loading.set(false);
        setTimeout(() => this.initScrollReveal(), 150);
      },
      error: (err) => {
        this.error.set('Failed to load projects. Please try again.');
        this.loading.set(false);
        // Show mock data if API not connected
        this.projects.set(this.getMockProjects());
        setTimeout(() => this.initScrollReveal(), 150);
      }
    });
  }

  filterByCategory(cat: ProjectCategory) {
    this.selectedCategory.set(cat);
    setTimeout(() => this.initScrollReveal(), 100);
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(' ', '-');
  }

  getMainImage(project: Project): string {
    const main = project.images?.find(i => i.isMain);
    return main?.url || project.images?.[0]?.url || 'assets/images/project-placeholder.jpg';
  }

  getCatIcon(cat: string): string {
    const map: Record<string, string> = {
      'Residential': 'home_work',
      'Commercial': 'business',
      'Interior Design': 'design_services',
      'Renovation': 'construction',
      'Architecture': 'architecture',
      'Industrial': 'factory',
    };
    return map[cat] || 'apartment';
  }

  initScrollReveal() {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  getMockProjects(): Project[] {
    return [
      {
        _id: '1', title: 'Skyline Residency', description: 'Luxury 24-floor residential tower with modern amenities',
        location: 'Mumbai, Maharashtra', category: 'Residential', status: 'Completed',
        images: [], isFeatured: true, rating: 5, createdAt: '', updatedAt: '',
        completionDate: '2023-12-01', client: 'Sharma Group', budget: '₹45 Cr', area: '2.5 Lakh sq.ft'
      },
      {
        _id: '2', title: 'TechHub Corporate Park', description: 'State-of-the-art IT park spread across 10 acres',
        location: 'Pune, Maharashtra', category: 'Commercial', status: 'Completed',
        images: [], isFeatured: true, rating: 5, createdAt: '', updatedAt: '',
        completionDate: '2023-06-01', client: 'InfoTech Corp', budget: '₹120 Cr', area: '8 Lakh sq.ft'
      },
      {
        _id: '3', title: 'Royal Villa Renovation', description: 'Complete luxury renovation of heritage villa',
        location: 'Pune, Maharashtra', category: 'Renovation', status: 'Completed',
        images: [], isFeatured: false, rating: 4, createdAt: '', updatedAt: ''
      },
      {
        _id: '4', title: 'Metro Mall', description: '5-story commercial shopping complex',
        location: 'Nashik, Maharashtra', category: 'Commercial', status: 'Ongoing',
        images: [], isFeatured: true, rating: 0, createdAt: '', updatedAt: ''
      },
      {
        _id: '5', title: 'Green Valley Homes', description: 'Eco-friendly residential complex with solar panels',
        location: 'Nagpur, Maharashtra', category: 'Residential', status: 'Ongoing',
        images: [], isFeatured: false, rating: 0, createdAt: '', updatedAt: ''
      },
      {
        _id: '6', title: 'Modern Office Interior', description: 'Complete interior redesign for 5000 sq.ft office',
        location: 'Mumbai, Maharashtra', category: 'Interior Design', status: 'Completed',
        images: [], isFeatured: false, rating: 5, createdAt: '', updatedAt: ''
      },
    ];
  }
}
