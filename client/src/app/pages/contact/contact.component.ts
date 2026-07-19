import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EnquiryService } from '../../core/services/enquiry.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  form: FormGroup;
  submitting = signal(false);
  submitted = signal(false);
  error = signal('');

  services = [
    'Residential Construction', 'Commercial Construction',
    'Interior Design', 'Renovation', 'Architecture Planning', 'General Inquiry'
  ];

  contactInfo = [
    { icon: 'location_on', label: 'Office Address', value: '123 Construction Avenue, Building District, Mumbai 400001', link: null },
    { icon: 'phone', label: 'Phone', value: '+91 98765 43210', link: 'tel:+919876543210' },
    { icon: 'email', label: 'Email', value: 'info@tarunconstruction.com', link: 'mailto:info@tarunconstruction.com' },
    { icon: 'schedule', label: 'Working Hours', value: 'Mon–Sat: 9:00 AM – 6:00 PM', link: null },
    { icon: 'chat', label: 'WhatsApp', value: '+91 98765 43210', link: 'https://wa.me/919876543210' },
  ];

  constructor(private fb: FormBuilder, private enquiryService: EnquiryService) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^[+]?[\d\s\-()]{7,20}$/)]],
      service: ['General Inquiry'],
      subject: [''],
      budget: [''],
      timeline: [''],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);
    this.error.set('');

    this.enquiryService.submitEnquiry(this.form.value).subscribe({
      next: () => {
        this.submitting.set(false);
        this.submitted.set(true);
        this.form.reset({ service: 'General Inquiry' });
      },
      error: (err) => {
        this.submitting.set(false);
        this.error.set('Failed to send. Please try again or call us directly.');
      }
    });
  }

  resetForm() { this.submitted.set(false); this.error.set(''); }
}
