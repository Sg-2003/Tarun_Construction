import { Component, signal, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss'
})
export class TestimonialsComponent implements AfterViewInit {
  currentSlide = signal(0);
  autoPlayInterval: any;

  testimonials = [
    { id: 1, name: 'Arjun Mehta', role: 'CEO', company: 'Mehta Group', rating: 5, project: 'TechHub Corporate Park', text: 'Tarun Construction delivered our 10-acre corporate campus six months ahead of schedule. The quality of work is outstanding — our employees love the space. The team\'s professionalism and transparency throughout the project was remarkable.', initials: 'AM' },
    { id: 2, name: 'Priya Sharma', role: 'Homeowner', company: '', rating: 5, project: 'Luxury Villa, Pune', text: 'Building our dream home was stress-free with Tarun Construction. They listened to every detail, suggested great improvements, and the final result surpassed our expectations. The 3D walkthroughs before construction started were a game-changer!', initials: 'PS' },
    { id: 3, name: 'Rajesh Patel', role: 'Director', company: 'Patel Developers', rating: 5, project: 'Skyline Residency', text: 'We\'ve worked with many contractors, but Tarun Construction stands a class apart. Their attention to detail, quality of materials, and project management systems are top-tier. Our 24-floor residential tower was completed perfectly.', initials: 'RP' },
    { id: 4, name: 'Sunita Nair', role: 'Restaurant Owner', company: 'Spice Garden', rating: 4, project: 'Interior Design & Renovation', text: 'The interior design team transformed our restaurant completely. From concept to execution, they captured our vision perfectly. Customers constantly compliment the ambience. Business has gone up 40% since the renovation!', initials: 'SN' },
    { id: 5, name: 'Dr. Anil Desai', role: 'Hospital Director', company: 'Desai Hospitals', rating: 5, project: 'Medical Complex, Nashik', text: 'Building a hospital requires extreme precision. Tarun Construction delivered a world-class medical complex with all the technical requirements met perfectly — HVAC, clean rooms, theatre facilities. Simply exceptional work.', initials: 'AD' },
    { id: 6, name: 'Kavita Joshi', role: 'Homeowner', company: '', rating: 5, project: '3BHK Apartment Renovation', text: 'They renovated our old apartment in just 45 days — that too with minimal disruption to our daily life. The quality of materials used is excellent and the workmen were clean and disciplined. Highly recommend!', initials: 'KJ' },
  ];

  get current() { return this.testimonials[this.currentSlide()]; }

  ngAfterViewInit() {
    this.startAutoPlay();
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) clearInterval(this.autoPlayInterval);
  }

  nextSlide() {
    this.currentSlide.update(s => (s + 1) % this.testimonials.length);
  }

  prevSlide() {
    this.currentSlide.update(s => (s - 1 + this.testimonials.length) % this.testimonials.length);
  }

  goToSlide(i: number) {
    this.stopAutoPlay();
    this.currentSlide.set(i);
    this.startAutoPlay();
  }

  getStars(n: number) { return Array(n).fill(0); }
}
