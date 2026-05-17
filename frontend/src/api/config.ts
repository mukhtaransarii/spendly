export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export function getToken(): string | null {
  return localStorage.getItem('token')
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const data = await res.json()
  console.log(data)

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong')
  }

  return data as T
}
