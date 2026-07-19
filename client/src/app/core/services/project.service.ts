import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, ProjectsResponse, ApiResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly API = '/api/projects';

  constructor(private http: HttpClient) {}

  getProjects(filters?: {
    category?: string;
    status?: string;
    featured?: boolean;
    page?: number;
    limit?: number;
  }): Observable<ProjectsResponse> {
    let params = new HttpParams();
    if (filters?.category && filters.category !== 'All') {
      params = params.set('category', filters.category);
    }
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.featured) params = params.set('featured', 'true');
    if (filters?.page) params = params.set('page', filters.page.toString());
    if (filters?.limit) params = params.set('limit', filters.limit.toString());

    return this.http.get<ProjectsResponse>(this.API, { params });
  }

  getProject(id: string): Observable<ApiResponse<Project>> {
    return this.http.get<ApiResponse<Project>>(`${this.API}/${id}`);
  }

  createProject(formData: FormData): Observable<ApiResponse<Project>> {
    return this.http.post<ApiResponse<Project>>(this.API, formData);
  }

  updateProject(id: string, formData: FormData): Observable<ApiResponse<Project>> {
    return this.http.put<ApiResponse<Project>>(`${this.API}/${id}`, formData);
  }

  deleteProject(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.API}/${id}`);
  }

  deleteProjectImage(projectId: string, publicId: string): Observable<ApiResponse<Project>> {
    return this.http.delete<ApiResponse<Project>>(
      `${this.API}/${projectId}/image/${encodeURIComponent(publicId)}`
    );
  }
}
