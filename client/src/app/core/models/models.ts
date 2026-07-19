// TypeScript models/interfaces for Tarun Construction

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  location: string;
  category: ProjectCategory;
  status: ProjectStatus;
  completionDate?: string;
  client?: string;
  budget?: string;
  area?: string;
  duration?: string;
  images: ProjectImage[];
  beforeImages?: ProjectImage[];
  afterImages?: ProjectImage[];
  features?: string[];
  isFeatured: boolean;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectImage {
  url: string;
  publicId?: string;
  caption?: string;
  isMain?: boolean;
}

export type ProjectCategory =
  | 'Residential'
  | 'Commercial'
  | 'Interior Design'
  | 'Renovation'
  | 'Architecture'
  | 'Industrial'
  | 'All';

export type ProjectStatus = 'Ongoing' | 'Completed' | 'Planning';

export interface ProjectsResponse {
  success: boolean;
  total: number;
  page: number;
  pages: number;
  data: Project[];
}

export interface Enquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  service?: string;
  message: string;
  budget?: string;
  timeline?: string;
  status: EnquiryStatus;
  isRead: boolean;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type EnquiryStatus = 'New' | 'In Progress' | 'Resolved' | 'Closed';

export interface EnquiriesResponse {
  success: boolean;
  total: number;
  unreadCount: number;
  page: number;
  pages: number;
  data: Enquiry[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface DashboardStats {
  totalProjects: number;
  completedProjects: number;
  ongoingProjects: number;
  totalEnquiries: number;
  newEnquiries: number;
  unreadEnquiries: number;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company?: string;
  avatar?: string;
  content: string;
  rating: number;
  project?: string;
  date?: string;
}

export interface Service {
  id: number;
  icon: string;
  title: string;
  description: string;
  features: string[];
  color: string;
  image?: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  avatar?: string;
  linkedin?: string;
  experience: string;
}

export interface Stat {
  value: string;
  label: string;
  icon: string;
  suffix?: string;
}
