import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnquiryService } from '../../../core/services/enquiry.service';
import { Enquiry } from '../../../core/models/models';

@Component({
  selector: 'app-admin-enquiries',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-enquiries.component.html',
  styleUrl: './admin-enquiries.component.scss'
})
export class AdminEnquiriesComponent implements OnInit {
  enquiries = signal<Enquiry[]>([]);
  loading = signal(true);
  selected = signal<Enquiry | null>(null);
  deleteConfirm = signal<string | null>(null);

  statuses = ['New', 'In Progress', 'Resolved', 'Closed'];

  constructor(private enquiryService: EnquiryService) {}

  ngOnInit() { this.loadEnquiries(); }

  loadEnquiries() {
    this.loading.set(true);
    this.enquiryService.getEnquiries({ limit: 100 }).subscribe({
      next: (res) => { this.enquiries.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  viewEnquiry(e: Enquiry) {
    this.selected.set(e);
    if (!e.isRead) {
      this.enquiryService.updateEnquiry(e._id, { isRead: true } as any).subscribe({
        next: (res) => {
          if (res.data) {
            this.enquiries.update(list => list.map(item => item._id === e._id ? (res.data || item) : item));
            if (this.selected()?._id === e._id) {
              this.selected.set(res.data);
            }
          }
        }
      });
    }
  }

  closeDetail() { this.selected.set(null); this.loadEnquiries(); }

  updateStatus(id: string, status: string) {
    this.enquiryService.updateEnquiry(id, { status } as any).subscribe({
      next: (res) => {
        if (res.data) {
          this.selected.set(res.data);
          this.enquiries.update(list => list.map(item => item._id === id ? (res.data || item) : item));
        } else {
          this.loadEnquiries();
        }
      }
    });
  }

  confirmDelete(id: string) { this.deleteConfirm.set(id); }
  cancelDelete() { this.deleteConfirm.set(null); }

  deleteEnquiry() {
    const id = this.deleteConfirm();
    if (!id) return;
    this.enquiryService.deleteEnquiry(id).subscribe({
      next: () => { this.deleteConfirm.set(null); this.selected.set(null); this.loadEnquiries(); }
    });
  }

  getStatusClass(s: string) {
    return { 'New': 'new', 'In Progress': 'progress', 'Resolved': 'resolved', 'Closed': 'closed' }[s] || 'new';
  }

  formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
}
