import { type User as FirebaseUser } from 'firebase/auth';

export type UserRole = 'user' | 'member' | 'admin';

export interface User extends FirebaseUser {
  role?: UserRole;
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
