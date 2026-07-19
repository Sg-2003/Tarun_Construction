import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models/models';

@Component({
  selector: 'app-admin-projects',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-projects.component.html',
  styleUrl: './admin-projects.component.scss'
})
export class AdminProjectsComponent implements OnInit {
  projects = signal<Project[]>([]);
  loading = signal(true);
  showForm = signal(false);
  editingProject = signal<Project | null>(null);
  deleteConfirm = signal<string | null>(null);
  saving = signal(false);
  form!: FormGroup;

  categories = ['Residential', 'Commercial', 'Interior Design', 'Renovation', 'Architecture', 'Industrial'];
  statuses = ['Planning', 'Ongoing', 'Completed'];

  constructor(private projectService: ProjectService, private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
    this.loadProjects();
  }

  buildForm() {
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      location: ['', [Validators.required]],
      category: ['Residential', [Validators.required]],
      status: ['Planning', [Validators.required]],
      client: [''],
      budget: [''],
      area: [''],
      duration: [''],
      features: [''],
      isFeatured: [false],
    });
  }

  loadProjects() {
    this.loading.set(true);
    this.projectService.getProjects({ limit: 100 }).subscribe({
      next: (res) => { this.projects.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  openAddForm() {
    this.editingProject.set(null);
    this.form.reset({ category: 'Residential', status: 'Planning', isFeatured: false });
    this.showForm.set(true);
  }

  openEditForm(p: Project) {
    this.editingProject.set(p);
    this.form.patchValue({ ...p, features: p.features?.join(', ') || '' });
    this.showForm.set(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelForm() { this.showForm.set(false); this.editingProject.set(null); }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);

    const formData = new FormData();
    Object.entries(this.form.value).forEach(([k, v]) => {
      if (v !== null && v !== undefined) formData.append(k, String(v));
    });

    const ep = this.editingProject();
    const obs = ep
      ? this.projectService.updateProject(ep._id, formData)
      : this.projectService.createProject(formData);

    obs.subscribe({
      next: () => {
        this.saving.set(false);
        this.cancelForm();
        this.loadProjects();
      },
      error: () => this.saving.set(false)
    });
  }

  confirmDelete(id: string) { this.deleteConfirm.set(id); }
  cancelDelete() { this.deleteConfirm.set(null); }

  deleteProject() {
    const id = this.deleteConfirm();
    if (!id) return;
    this.projectService.deleteProject(id).subscribe({
      next: () => { this.deleteConfirm.set(null); this.loadProjects(); },
      error: () => this.deleteConfirm.set(null)
    });
  }

  get f() { return this.form.controls; }
}
