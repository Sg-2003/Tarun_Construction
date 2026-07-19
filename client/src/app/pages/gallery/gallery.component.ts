import { Component, OnInit, AfterViewInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent implements OnInit, AfterViewInit {
  selectedImage = signal<any>(null);
  selectedFilter = signal('All');
  loading = signal(true);

  filters = ['All', 'Residential', 'Commercial', 'Interior', 'Renovation', 'Architecture'];
  galleryItems = signal<any[]>([]);

  filteredProjects = computed(() => {
    const f = this.selectedFilter();
    const items = this.galleryItems();
    return f === 'All' ? items : items.filter(i => i.category === f);
  });

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.loadGalleryItems();
  }

  ngAfterViewInit() {
    this.initScrollReveal();
  }

  initScrollReveal() {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  filterGallery(f: string) {
    this.selectedFilter.set(f);
    setTimeout(() => this.initScrollReveal(), 100);
  }

  loadGalleryItems() {
    this.loading.set(true);
    this.projectService.getProjects({ limit: 100 }).subscribe({
      next: (res) => {
        try {
          const items: any[] = [];
          let index = 1;

          if (res && res.data && Array.isArray(res.data)) {
            res.data.forEach((project: any) => {
              // Map DB category to gallery filter categories
              let category = project.category || 'Architecture';
              if (category === 'Interior Design') {
                category = 'Interior';
              } else if (category === 'Industrial') {
                category = 'Architecture';
              }

              const icon = this.getCatIcon(category);
              const color = this.getCatColor(category);
              const title = project.title || 'Untitled Project';
              const location = project.location ? project.location.split(',')[0] : 'India';

              if (project.images && project.images.length > 0) {
                project.images.forEach((img: any) => {
                  items.push({
                    id: index++,
                    dbId: project._id,
                    category,
                    title: img.caption || title,
                    location: location,
                    imageUrl: img.url,
                    color,
                    icon
                  });
                });
              } else {
                // Fallback item if no images are uploaded yet
                items.push({
                  id: index++,
                  dbId: project._id,
                  category,
                  title: title,
                  location: location,
                  imageUrl: null,
                  color,
                  icon
                });
              }
            });
          }

          // If no items were parsed, fall back to default design placeholders
          this.galleryItems.set(items.length > 0 ? items : this.getDefaultMockItems());
          this.loading.set(false);
          setTimeout(() => this.initScrollReveal(), 150);
        } catch (err) {
          console.error('Error parsing gallery items:', err);
          this.galleryItems.set(this.getDefaultMockItems());
          this.loading.set(false);
          setTimeout(() => this.initScrollReveal(), 150);
        }
      },
      error: (err) => {
        console.error('Error loading gallery items:', err);
        this.galleryItems.set(this.getDefaultMockItems());
        this.loading.set(false);
        setTimeout(() => this.initScrollReveal(), 150);
      }
    });
  }

  get filtered() {
    return this.filteredProjects();
  }

  getCatIcon(category: string): string {
    const map: Record<string, string> = {
      'Residential': 'home_work',
      'Commercial': 'business',
      'Interior': 'design_services',
      'Renovation': 'construction',
      'Architecture': 'architecture',
    };
    return map[category] || 'apartment';
  }

  getCatColor(category: string): string {
    const map: Record<string, string> = {
      'Residential': '#2e2508',
      'Commercial': '#082e24',
      'Interior': '#160830',
      'Renovation': '#3d1808',
      'Architecture': '#0f2e08',
    };
    return map[category] || '#1a1a1a';
  }

  getDefaultMockItems() {
    return [
      { id: 1, category: 'Residential', title: 'Skyline Tower', location: 'Mumbai', color: '#2e2508', icon: 'home_work', imageUrl: null },
      { id: 2, category: 'Commercial', title: 'TechHub Park', location: 'Pune', color: '#082e24', icon: 'business', imageUrl: null },
      { id: 3, category: 'Interior', title: 'Modern Office Suite', location: 'Mumbai', color: '#160830', icon: 'design_services', imageUrl: null },
      { id: 4, category: 'Renovation', title: 'Heritage Villa', location: 'Pune', color: '#3d1808', icon: 'construction', imageUrl: null },
      { id: 5, category: 'Architecture', title: 'Urban Blueprint', location: 'Nashik', color: '#0f2e08', icon: 'architecture', imageUrl: null },
      { id: 6, category: 'Residential', title: 'Green Valley Homes', location: 'Nagpur', color: '#1a1505', icon: 'home_work', imageUrl: null },
      { id: 7, category: 'Commercial', title: 'Metro Mall', location: 'Nashik', color: '#051a14', icon: 'storefront', imageUrl: null },
      { id: 8, category: 'Interior', title: 'Luxury Penthouse', location: 'Mumbai', color: '#0a0518', icon: 'weekend', imageUrl: null },
      { id: 9, category: 'Renovation', title: 'Colonial Bungalow', location: 'Pune', color: '#2e1208', icon: 'domain', imageUrl: null },
      { id: 10, category: 'Architecture', title: 'Industrial Complex', location: 'Aurangabad', color: '#141414', icon: 'factory', imageUrl: null },
      { id: 11, category: 'Residential', title: 'Riverside Villas', location: 'Nashik', color: '#1a1505', icon: 'villa', imageUrl: null },
      { id: 12, category: 'Commercial', title: 'Corporate Tower', location: 'Mumbai', color: '#082e24', icon: 'apartment', imageUrl: null },
    ];
  }

  openLightbox(item: any) { this.selectedImage.set(item); }
  closeLightbox() { this.selectedImage.set(null); }

  prevImage() {
    const filtered = this.filtered;
    const idx = filtered.findIndex(i => i.id === this.selectedImage()?.id);
    this.selectedImage.set(filtered[(idx - 1 + filtered.length) % filtered.length]);
  }

  nextImage() {
    const filtered = this.filtered;
    const idx = filtered.findIndex(i => i.id === this.selectedImage()?.id);
    this.selectedImage.set(filtered[(idx + 1) % filtered.length]);
  }
}
