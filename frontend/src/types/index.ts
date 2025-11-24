export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}