import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header">
      <h1>Our <span>Services</span></h1>
      <nav class="breadcrumb">
        <a routerLink="/">Home</a>
        <span class="material-icons-round">chevron_right</span>
        <span>Services</span>
      </nav>
    </div>

    <section class="section-padding services-page">
      <div class="container">
        <div class="section-header">
          <div class="section-badge"><span class="material-icons-round">build</span> What We Build</div>
          <h2 class="section-heading">Comprehensive <span>Construction</span> Services</h2>
          <p class="section-subtitle">From laying the foundation to the final finish, we deliver excellence across every construction domain.</p>
        </div>

        <div class="services-detail-grid">
          @for (svc of services; track svc.title; let i = $index) {
            <div class="svc-detail-card reveal" [class.reverse]="i % 2 === 1">
              <div class="svc-visual">
                <div class="svc-icon-large" [style.background]="'rgba(' + svc.rgb + ',0.08)'" [style.border-color]="'rgba(' + svc.rgb + ',0.2)'">
                  <span class="material-icons-round" [style.color]="svc.color">{{ svc.icon }}</span>
                </div>
                <div class="svc-number">0{{ i + 1 }}</div>
              </div>
              <div class="svc-content">
                <span class="section-badge" [style.color]="svc.color" [style.border-color]="'rgba(' + svc.rgb + ',0.3)'" [style.background]="'rgba(' + svc.rgb + ',0.08)'">{{ svc.tag }}</span>
                <h3>{{ svc.title }}</h3>
                <p>{{ svc.description }}</p>
                <ul class="svc-features">
                  @for (feat of svc.features; track feat) {
                    <li>
                      <span class="material-icons-round" [style.color]="svc.color">check_circle</span>
                      {{ feat }}
                    </li>
                  }
                </ul>
                <a routerLink="/contact" class="btn-primary" style="margin-top: 1.5rem;">
                  <span class="material-icons-round">request_quote</span>
                  Get Quote
                </a>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Process Section -->
    <section class="process-section section-padding">
      <div class="container">
        <div class="section-header">
          <div class="section-badge"><span class="material-icons-round">timeline</span> How We Work</div>
          <h2 class="section-heading">Our <span>Process</span></h2>
          <p class="section-subtitle">A transparent, step-by-step approach ensuring your project is delivered on time and within budget.</p>
        </div>
        <div class="process-steps">
          @for (step of process; track step.num) {
            <div class="process-step reveal">
              <div class="step-num">{{ step.num }}</div>
              <div class="step-icon"><span class="material-icons-round">{{ step.icon }}</span></div>
              <h4>{{ step.title }}</h4>
              <p>{{ step.desc }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styleUrl: './services.component.scss'
})
export class ServicesComponent {
  services = [
    {
      icon: 'home_work', title: 'Residential Construction', color: '#F4B400', rgb: '244,180,0',
      tag: 'Residential', description: 'We design and build dream homes that reflect your personality and lifestyle. From cozy bungalows to luxurious multi-storey villas, we handle every aspect of residential construction with precision and care.',
      features: ['Custom home design & architecture', 'Foundation to roof completion', 'Premium material sourcing', 'Interior & exterior finishing', 'Vastu-compliant construction', 'Smart home integration']
    },
    {
      icon: 'business', title: 'Commercial Construction', color: '#FF6B00', rgb: '255,107,0',
      tag: 'Commercial', description: 'Transform your business vision into impressive commercial spaces. We build offices, retail complexes, hotels, and mixed-use developments that make a strong first impression.',
      features: ['Office parks & corporate campuses', 'Retail & shopping complexes', 'Hotels & hospitality projects', 'Warehouses & logistics hubs', 'Green building certification', 'MEP engineering & integration']
    },
    {
      icon: 'design_services', title: 'Interior Design', color: '#F4B400', rgb: '244,180,0',
      tag: 'Interior', description: 'Our interior design team creates spaces that are as functional as they are beautiful. We work with you to develop concepts that perfectly blend your taste with practical needs.',
      features: ['Residential & commercial interiors', 'Space planning & 3D visualization', 'Custom furniture & joinery', 'Lighting design', 'Material & finish selection', 'Turnkey interior execution']
    },
    {
      icon: 'construction', title: 'Renovation & Remodelling', color: '#FF6B00', rgb: '255,107,0',
      tag: 'Renovation', description: 'Breathe new life into existing structures with our expert renovation services. We handle everything from minor facelifts to complete structural overhauls, preserving the essence while adding modern functionality.',
      features: ['Full-scale home renovations', 'Office refurbishment', 'Heritage building restoration', 'Kitchen & bathroom upgrades', 'Structural repairs', 'Before & after project documentation']
    },
    {
      icon: 'architecture', title: 'Architecture Planning', color: '#F4B400', rgb: '244,180,0',
      tag: 'Architecture', description: 'Our RIBA-accredited architects combine creative vision with technical expertise to produce architectural blueprints that are both stunning and structurally sound.',
      features: ['Concept design & master planning', 'Detailed architectural drawings', 'Structural & MEP drawings', 'Permit & regulatory approvals', '3D modelling & walkthroughs', 'Sustainable design principles']
    },
    {
      icon: 'factory', title: 'Industrial Projects', color: '#FF6B00', rgb: '255,107,0',
      tag: 'Industrial', description: 'Large-scale industrial facilities require specialized expertise. We deliver factories, manufacturing plants, and industrial complexes built to stringent safety and efficiency standards.',
      features: ['Manufacturing plant construction', 'Cold storage & warehousing', 'Power plant infrastructure', 'Safety-compliant design', 'Heavy civil engineering', 'EPC project management']
    },
  ];

  process = [
    { num: '01', icon: 'groups', title: 'Consultation', desc: 'We discuss your requirements, vision, and budget in a free initial meeting.' },
    { num: '02', icon: 'design_services', title: 'Design & Plan', desc: 'Our architects produce detailed designs and obtain all necessary permits.' },
    { num: '03', icon: 'payments', title: 'Quotation', desc: 'We provide a transparent, itemised cost estimate with no hidden charges.' },
    { num: '04', icon: 'handshake', title: 'Agreement', desc: 'We sign a clear contract outlining scope, timeline, and payment milestones.' },
    { num: '05', icon: 'construction', title: 'Construction', desc: 'Our expert team begins work with regular progress updates to you.' },
    { num: '06', icon: 'verified', title: 'Handover', desc: 'Quality inspection, snag list completion, and final project handover.' },
  ];
}
