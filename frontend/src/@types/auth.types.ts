export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  profile_picture: string | null;
}

export interface Tokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  tokens: Tokens;
  user: User;
}

export interface LoginData {
  identifier: string; // can be email or username
  password: string;
}

export const Roles = {
  Tourist: 'Tourist',
  Guide: 'Guide',
  Admin: 'Admin',
}

export type Role = typeof Roles[keyof typeof Roles];