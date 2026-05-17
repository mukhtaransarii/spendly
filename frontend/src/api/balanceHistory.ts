import { apiFetch } from './config'
import type { BalanceHistoryEntry } from '../types'

// Backend returns _id + extra fields, we normalize to frontend shape
function normalize(e: any): BalanceHistoryEntry {
  return {
    id: e._id,
    cash: e.cash,
    online: e.online,
    note: e.note || '',
    date: e.date,
    time: e.time,
  }
}

export async function fetchBalanceHistory(): Promise<BalanceHistoryEntry[]> {
  const data = await apiFetch<any[]>('/balance-history')
  return data.map(normalize)
}

export async function addBalance(
  entry: Omit<BalanceHistoryEntry, 'id'>
): Promise<{ entry: BalanceHistoryEntry; wallet: { cash: number; online: number } }> {
  const data = await apiFetch<any>('/balance-history', {
    method: 'POST',
    body: JSON.stringify(entry),
  })
  return { entry: normalize(data.entry), wallet: data.wallet }
}

export async function updateBalanceHistory(
  id: string,
  entry: Partial<Omit<BalanceHistoryEntry, 'id'>>
): Promise<{ entry: BalanceHistoryEntry; wallet: { cash: number; online: number } }> {
  const data = await apiFetch<any>(`/balance-history/${id}`, {
    method: 'PUT',
    body: JSON.stringify(entry),
  })
  return { entry: normalize(data.entry), wallet: data.wallet }
}

export async function deleteBalanceHistory(
  id: string
): Promise<{ id: string; wallet: { cash: number; online: number } }> {
  const data = await apiFetch<any>(`/balance-history/${id}`, { method: 'DELETE' })
  return { id, wallet: data.wallet }
}
