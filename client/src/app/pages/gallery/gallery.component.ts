import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent {
  selectedImage = signal<any>(null);
  selectedFilter = signal('All');

  filters = ['All', 'Residential', 'Commercial', 'Interior', 'Renovation', 'Architecture'];

  galleryItems = [
    { id: 1, category: 'Residential', title: 'Skyline Tower', location: 'Mumbai', color: '#2e2508', icon: 'home_work' },
    { id: 2, category: 'Commercial', title: 'TechHub Park', location: 'Pune', color: '#082e24', icon: 'business' },
    { id: 3, category: 'Interior', title: 'Modern Office Suite', location: 'Mumbai', color: '#160830', icon: 'design_services' },
    { id: 4, category: 'Renovation', title: 'Heritage Villa', location: 'Pune', color: '#3d1808', icon: 'construction' },
    { id: 5, category: 'Architecture', title: 'Urban Blueprint', location: 'Nashik', color: '#0f2e08', icon: 'architecture' },
    { id: 6, category: 'Residential', title: 'Green Valley Homes', location: 'Nagpur', color: '#1a1505', icon: 'home_work' },
    { id: 7, category: 'Commercial', title: 'Metro Mall', location: 'Nashik', color: '#051a14', icon: 'storefront' },
    { id: 8, category: 'Interior', title: 'Luxury Penthouse', location: 'Mumbai', color: '#0a0518', icon: 'weekend' },
    { id: 9, category: 'Renovation', title: 'Colonial Bungalow', location: 'Pune', color: '#2e1208', icon: 'domain' },
    { id: 10, category: 'Architecture', title: 'Industrial Complex', location: 'Aurangabad', color: '#141414', icon: 'factory' },
    { id: 11, category: 'Residential', title: 'Riverside Villas', location: 'Nashik', color: '#1a1505', icon: 'villa' },
    { id: 12, category: 'Commercial', title: 'Corporate Tower', location: 'Mumbai', color: '#082e24', icon: 'apartment' },
  ];

  get filtered() {
    const f = this.selectedFilter();
    return f === 'All' ? this.galleryItems : this.galleryItems.filter(i => i.category === f);
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
