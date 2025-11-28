import { type User as FirebaseUser } from 'firebase/auth';

export type UserRole = 'user' | 'member' | 'admin';

export interface User extends FirebaseUser {
    role: UserRole;
    id: number
    deletedAt?: Date;
    isActive: boolean
    isView: boolean
}
// Type definitions for the application

export type Role = "MEMBER" | "OFFICER" | "ADMIN"
export type LibraryType = "BOOK" | "JOURNAL" | "VIDEO" | "AUDIO" | "OTHER"
export type CalendarItemType = "EVENT" | "ACTIVITY" | "MEETING"
export type ProjectStatus = "ACTIVE" | "COMPLETED" | "ARCHIVED" | "CANCELLED"
export type RSVPStatus = "PENDING" | "CONFIRMED" | "DECLINED" | "TENTATIVE"

export  interface Project {
  id: number;
  title: string;
  slug: string;
  description?: string;
  category?: string;
  status: ProjectStatus;
  creatorId: number;
  creator: User;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  members?: ProjectMember[];
  updates?: ProjectUpdate[];
}

export interface ProjectMember {
  id: number;
  projectId: number;
  userId: number;
  user: User;
  role: Role;
  joinedAt: Date;
}

export interface ProjectUpdate {
  id: number;
  projectId: number;
  title: string;
  content: string;
  createdById: number;
  createdBy: User;
  createdAt: Date;
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  thumbnail?: string;
  location?: string;
  createdById: number;
  createdBy: User;
  startAt: Date;
  endAt?: Date;
  isPublic: boolean;
  maxAttendees?: number;
  form?: Form;
  attendeesCount?: number;
}

export interface Activity {
  id: number;
  title: string;
  description?: string;
  createdById: number;
  createdBy: User;
  startAt: Date;
  endAt?: Date;
  isMemberOnly: boolean;
}

export interface Meeting {
  id: number;
  title: string;
  agenda?: string;
  location?: string;
  createdById: number;
  createdBy: User;
  startAt: Date;
  endAt?: Date;
}

export interface LibraryItem {
  id: number;
  title: string;
  thumbnail?: string;
  description?: string;
  type: LibraryType;
  url?: string;
  metadata?: any;
  createdById: number;
  createdBy: User;
  createdAt: Date;
  isPublic: boolean;
}

interface Form {
  id: number;
  title: string;
  description?: string;
  createdById: number;
  createdBy: User;
  fields: any;
  isActive: boolean;
  eventId?: number;
  attendeesCount?: number;
}

export interface CalendarEntry {
  id: number;
  type: CalendarItemType;
  title: string;
  description?: string;
  location?: string;
  startAt: Date;
  endAt?: Date;
  isAllDay: boolean;
  createdById: number;
  createdBy: User;
  eventId?: number;
  activityId?: number;
  meetingId?: number;
}

export interface Attendee {
  id: number;
  formId: number;
  userId: number;
  user: User;
  formData?: any;
  createdAt: Date;
}
export interface Blog {
  id: string;
  userId: string;
  authorName: string;
  authorEmail: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  status: 'draft' | 'published';
  views: number;
  likes: number;
  createdAt: string;
  updatedAt?: string;
}

export interface JoinRequest {
  id: string;
  userId: string;
  name: string;
  email: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}
