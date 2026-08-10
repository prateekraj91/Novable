import { apiRequest } from './api';
import { UserLogin, UserRegister, User } from '@/types/auth';

export const TOKEN_KEY = 'expensepulse_jwt_token';

export async function login(credentials: UserLogin): Promise<User> {
  const response = await apiRequest<{ access_token: string; token_type: string }>('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, // FastAPI OAuth2 expects form data
    body: `username=${encodeURIComponent(credentials.email)}&password=${encodeURIComponent(credentials.password)}`,
  });
  localStorage.setItem(TOKEN_KEY, response.access_token);
  const user = await fetchCurrentUser(); // Fetch user details after login
  return user;
}

export async function register(userData: UserRegister): Promise<User> {
  const response = await apiRequest<User>('/auth/register', {
    method: 'POST',
    body: userData,
  });
  // After successful registration, automatically log in the user
  const tokenResponse = await apiRequest<{ access_token: string; token_type: string }>('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `username=${encodeURIComponent(userData.email)}&password=${encodeURIComponent(userData.password)}`,
  });
  localStorage.setItem(TOKEN_KEY, tokenResponse.access_token);
  return response;
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export async function fetchCurrentUser(): Promise<User | null> {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return null;
    }
    const user = await apiRequest<User>('/users/me');
    return user;
  } catch (error) {
    console.error('Failed to fetch current user:', error);
    logout(); // Clear token if it's invalid or expired
    return null;
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
