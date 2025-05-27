// frontend/src/types/index.ts
export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  token?: string;
  refreshToken?: string;
  avatar?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loading: boolean;
  error?: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  isUser: boolean;
  isRead?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  lessons: Lesson[];
  duration: number;
  thumbnail?: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  duration: number;
  type: 'video' | 'text' | 'quiz';
  resources?: Resource[];
}

export interface Resource {
  id: string;
  type: 'video' | 'document' | 'link';
  url: string;
  title: string;
  description?: string;
}

// Tipos para IndexedDB
export interface OfflineContent {
  id: string;
  type: 'course' | 'lesson' | 'resource';
  data: any;
  lastSync: string;
}

export interface OfflineAction {
  id: string;
  type: 'message' | 'quiz' | 'note';
  data: any;
  timestamp: string;
  synced: boolean;
}
