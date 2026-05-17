import * as ExpensesAPI from '../api/expenses'
import * as WalletAPI from '../api/wallet'

export async function migrateLocalData() {
  const rawExpenses = localStorage.getItem('expenses')
  const rawWallet = localStorage.getItem('wallet')
  const rawHistory = localStorage.getItem('balance_history')

  const expenses = rawExpenses ? JSON.parse(rawExpenses) : []
  const wallet = rawWallet ? JSON.parse(rawWallet) : null
  const history = rawHistory ? JSON.parse(rawHistory) : []

  // 1. Save expenses one by one
  for (const e of expenses) {
    const { id, ...rest } = e
    await ExpensesAPI.createExpense(rest)
  }

  // 3. Save balance history entries (without affecting wallet since we set it directly above)
  for (const entry of history) {
    const { id, ...rest } = entry
    // POST directly to avoid double-counting wallet — use a raw fetch
    await fetch(`${import.meta.env.VITE_API_URL}/balance-history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(rest),
    })
  }

  if (wallet) {
    await WalletAPI.setWallet(wallet)
  }

  // 4. Clear localStorage
  // localStorage.removeItem('expenses')
  // localStorage.removeItem('wallet')
  // localStorage.removeItem('balance_history')
  alert('succes persit uploaded on db')
}