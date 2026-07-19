import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  milestones = [
    { year: '2005', title: 'Founded', desc: 'Tarun Construction was established with a team of 5 and a vision to redefine quality construction.' },
    { year: '2008', title: 'First Major Project', desc: 'Completed our first large-scale commercial complex in Mumbai — a milestone that put us on the map.' },
    { year: '2012', title: 'ISO Certification', desc: 'Awarded ISO 9001:2008 certification for our quality management systems.' },
    { year: '2015', title: 'Expanded Services', desc: 'Launched Interior Design and Architecture Planning divisions to offer end-to-end services.' },
    { year: '2018', title: '100 Projects', desc: 'Crossed the landmark of 100 successfully completed projects across Maharashtra.' },
    { year: '2020', title: 'Sustainable Building', desc: 'Adopted green building practices and received LEED certification for our first eco-project.' },
    { year: '2023', title: '500+ Projects', desc: 'Celebrated 500+ completed projects and expanded operations across 5 states.' },
    { year: '2025', title: 'Award Winning', desc: 'Received the Best Construction Company Award at the National Real Estate Summit.' },
  ];

  team = [
    { name: 'Tarun Sharma', role: 'Founder & CEO', exp: '20+ years', icon: 'person', specialty: 'Structural Engineering' },
    { name: 'Priya Mehta', role: 'Chief Architect', exp: '15+ years', icon: 'architecture', specialty: 'Sustainable Architecture' },
    { name: 'Rajesh Kumar', role: 'Project Director', exp: '18+ years', icon: 'engineering', specialty: 'Project Management' },
    { name: 'Anita Patel', role: 'Head of Interior Design', exp: '12+ years', icon: 'design_services', specialty: 'Luxury Interiors' },
  ];

  certifications = [
    { icon: 'verified_user', title: 'ISO 9001:2015', desc: 'Quality Management Systems' },
    { icon: 'eco', title: 'LEED Certified', desc: 'Green Building Standards' },
    { icon: 'safety_check', title: 'OSHA Compliant', desc: 'Workplace Safety Standards' },
    { icon: 'military_tech', title: 'BIS Registered', desc: 'Bureau of Indian Standards' },
  ];
}
