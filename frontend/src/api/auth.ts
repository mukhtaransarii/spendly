import { apiFetch } from './config'

export interface AuthResponse {
  _id: string
  name: string
  email: string
  token: string
}

export interface MeResponse {
  _id: string
  name: string
  email: string
}

export async function registerUser(name: string, email: string, password: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function getMe(): Promise<MeResponse> {
  return apiFetch<MeResponse>('/auth/me')
}
