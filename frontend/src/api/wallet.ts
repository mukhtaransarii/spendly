import { apiFetch } from './config'
import type { Wallet } from '../types'

export async function fetchWallet(): Promise<Wallet> {
  const data = await apiFetch<any>('/wallet')
  return { cash: data.cash, online: data.online }
}

export async function setWallet(wallet: Wallet): Promise<Wallet> {
  const data = await apiFetch<any>('/wallet', {
    method: 'PUT',
    body: JSON.stringify(wallet),
  })
  return { cash: data.cash, online: data.online }
}
