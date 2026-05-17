import { apiFetch } from './config'
import type { Expense } from '../types'

// Backend returns _id, frontend uses id — we normalize here
function normalize(e: any): Expense {
  return {
    id: e._id,
    title: e.title,
    category: e.category,
    amount: e.amount,
    note: e.note || '',
    date: e.date,
    time: e.time,
    method: e.method,
  }
}

export async function fetchExpenses(): Promise<Expense[]> {
  const data = await apiFetch<any[]>('/expenses')
  return data.map(normalize)
}

export async function createExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
  const data = await apiFetch<any>('/expenses', {
    method: 'POST',
    body: JSON.stringify(expense),
  })
  return normalize(data)
}

export async function updateExpense(id: string, expense: Omit<Expense, 'id'>): Promise<Expense> {
  const data = await apiFetch<any>(`/expenses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(expense),
  })
  return normalize(data)
}

export async function deleteExpense(id: string): Promise<{ id: string }> {
  await apiFetch(`/expenses/${id}`, { method: 'DELETE' })
  return { id }
}
