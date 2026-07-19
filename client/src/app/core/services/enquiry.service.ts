import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enquiry, EnquiriesResponse, ApiResponse, DashboardStats } from '../models/models';

@Injectable({ providedIn: 'root' })
export class EnquiryService {
  private readonly API = '/api/enquiries';

  constructor(private http: HttpClient) {}

  submitEnquiry(data: Partial<Enquiry>): Observable<ApiResponse<Enquiry>> {
    return this.http.post<ApiResponse<Enquiry>>(this.API, data);
  }

  getEnquiries(filters?: {
    status?: string;
    isRead?: boolean;
    page?: number;
    limit?: number;
  }): Observable<EnquiriesResponse> {
    let params = new HttpParams();
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.isRead !== undefined) params = params.set('isRead', filters.isRead.toString());
    if (filters?.page) params = params.set('page', filters.page.toString());
    if (filters?.limit) params = params.set('limit', filters.limit.toString());

    return this.http.get<EnquiriesResponse>(this.API, { params });
  }

  getEnquiry(id: string): Observable<ApiResponse<Enquiry>> {
    return this.http.get<ApiResponse<Enquiry>>(`${this.API}/${id}`);
  }

  updateEnquiry(id: string, data: Partial<Enquiry>): Observable<ApiResponse<Enquiry>> {
    return this.http.put<ApiResponse<Enquiry>>(`${this.API}/${id}`, data);
  }

  deleteEnquiry(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.API}/${id}`);
  }

  getStats(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(`${this.API}/stats`);
  }
}
