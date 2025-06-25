export interface User {
  id: number;
  email: string;
  username: string;
  fullName?: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  department?: string;
  position?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export type UserRole = 'admin' | 'manager' | 'developer' | 'viewer';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  fullName: string;
  password: string;
  confirmPassword: string;
  role?: UserRole;
  phone?: string;
  department?: string;
  position?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  tokenType: string;
}
