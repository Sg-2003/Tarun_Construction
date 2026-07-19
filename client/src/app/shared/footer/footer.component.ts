import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="footer">
      <!-- Main Footer -->
      <div class="footer-main">
        <div class="container">
          <div class="footer-grid">
            <!-- Brand -->
            <div class="footer-brand">
              <a routerLink="/" class="footer-logo">
                <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" width="52" height="52">
                  <rect x="10" y="20" width="40" height="35" rx="2" fill="#F4B400" opacity="0.9"/>
                  <rect x="18" y="28" width="8" height="8" rx="1" fill="#1C1C1C"/>
                  <rect x="34" y="28" width="8" height="8" rx="1" fill="#1C1C1C"/>
                  <rect x="24" y="36" width="12" height="19" rx="1" fill="#1C1C1C"/>
                  <rect x="5" y="18" width="50" height="4" rx="2" fill="#FF6B00"/>
                  <rect x="28" y="2" width="4" height="18" rx="2" fill="#FF6B00"/>
                  <rect x="28" y="2" width="18" height="3" rx="1.5" fill="#FF6B00"/>
                </svg>
                <div>
                  <span class="name">Tarun Construction</span>
                  <span class="tagline">Building the Future</span>
                </div>
              </a>
              <p class="footer-desc">
                Delivering excellence in residential, commercial, and interior construction
                since 2005. Quality craftsmanship meets modern innovation.
              </p>
              <div class="social-links">
                <a href="#" aria-label="Facebook" class="social-icon">
                  <span class="material-icons-round">facebook</span>
                </a>
                <a href="#" aria-label="Instagram" class="social-icon">
                  <span class="material-icons-round">photo_camera</span>
                </a>
                <a href="#" aria-label="LinkedIn" class="social-icon">
                  <span class="material-icons-round">work</span>
                </a>
                <a href="https://wa.me/919876543210" aria-label="WhatsApp" class="social-icon whatsapp">
                  <span class="material-icons-round">chat</span>
                </a>
              </div>
            </div>

            <!-- Quick Links -->
            <div class="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li><a routerLink="/">Home</a></li>
                <li><a routerLink="/about">About Us</a></li>
                <li><a routerLink="/services">Services</a></li>
                <li><a routerLink="/projects">Projects</a></li>
                <li><a routerLink="/gallery">Gallery</a></li>
                <li><a routerLink="/contact">Contact</a></li>
              </ul>
            </div>

            <!-- Services -->
            <div class="footer-col">
              <h4>Our Services</h4>
              <ul>
                <li><a routerLink="/services">Residential Construction</a></li>
                <li><a routerLink="/services">Commercial Construction</a></li>
                <li><a routerLink="/services">Interior Design</a></li>
                <li><a routerLink="/services">Renovation</a></li>
                <li><a routerLink="/services">Architecture Planning</a></li>
                <li><a routerLink="/services">Industrial Projects</a></li>
              </ul>
            </div>

            <!-- Contact Info -->
            <div class="footer-col">
              <h4>Contact Us</h4>
              <ul class="contact-list">
                <li>
                  <span class="material-icons-round">location_on</span>
                  <span>123 Construction Avenue,<br>Building District, City 400001</span>
                </li>
                <li>
                  <span class="material-icons-round">phone</span>
                  <a href="tel:+919876543210">+91 98765 43210</a>
                </li>
                <li>
                  <span class="material-icons-round">email</span>
                  <a href="mailto:info@tarunconstruction.com">info&#64;tarunconstruction.com</a>
                </li>
                <li>
                  <span class="material-icons-round">schedule</span>
                  <span>Mon–Sat: 9:00 AM – 6:00 PM</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <div class="container">
          <div class="footer-bottom-inner">
            <p>© {{ year }} Tarun Construction. All rights reserved.</p>
            <p>Built with ❤️ using MEAN Stack + Three.js</p>
          </div>
        </div>
      </div>
    </footer>
  `,
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  year = new Date().getFullYear();
}
