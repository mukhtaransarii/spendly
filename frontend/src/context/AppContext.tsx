import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { Expense, Wallet, BalanceHistoryEntry, AppContextType, User } from '../types'

import { loginUser, registerUser } from '../api/auth'
import * as ExpensesAPI from '../api/expenses'
import * as WalletAPI from '../api/wallet'
import * as BalanceAPI from '../api/balanceHistory'

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [authLoading, setAuthLoading] = useState(true)

  const [expenses, setExpenses] = useState<Expense[]>([])
  const [wallet, setWalletState] = useState<Wallet>({ cash: 0, online: 0 })
  const [balanceHistory, setBalanceHistory] = useState<BalanceHistoryEntry[]>([])
  const [loading, setLoading] = useState(false)

  // ─── Auth ─────────────────────────────────────────────────────────────────

  const login = useCallback(async (email: string, password: string) => {
    const res = await loginUser(email, password)
    localStorage.setItem('token', res.token)
    setToken(res.token)
    setUser({ _id: res._id, name: res.name, email: res.email })
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await registerUser(name, email, password)
    localStorage.setItem('token', res.token)
    setToken(res.token)
    setUser({ _id: res._id, name: res.name, email: res.email })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    setExpenses([])
    setWalletState({ cash: 0, online: 0 })
    setBalanceHistory([])
  }, [])

  // ─── Load data after login ─────────────────────────────────────────────────

  useEffect(() => {
    if (!token) {
      setAuthLoading(false)
      return
    }

    setLoading(true)
    Promise.all([
      ExpensesAPI.fetchExpenses(),
      WalletAPI.fetchWallet(),
      BalanceAPI.fetchBalanceHistory(),
    ])
      .then(([exp, wal, bal]) => {
        setExpenses(exp)
        setWalletState(wal)
        setBalanceHistory(bal)
        // Restore user from token if page was refreshed
        import('../api/auth').then(({ getMe }) =>
          getMe().then(me => setUser({ _id: me._id, name: me.name, email: me.email }))
        )
      })
      .catch(() => {
        // Token expired or invalid
        logout()
      })
      .finally(() => {
        setLoading(false)
        setAuthLoading(false)
      })
  }, [token, logout])

  // ─── Expenses ─────────────────────────────────────────────────────────────

  const addExpense = useCallback(async (expense: Omit<Expense, 'id'>) => {
    const created = await ExpensesAPI.createExpense(expense)
    setExpenses(prev => [created, ...prev])
  }, [])

  const updateExpense = useCallback(async (expense: Expense) => {
    const { id, ...rest } = expense
    const updated = await ExpensesAPI.updateExpense(id, rest)
    setExpenses(prev => prev.map(e => (e.id === id ? updated : e)))
  }, [])

  const deleteExpense = useCallback(async (id: string) => {
    await ExpensesAPI.deleteExpense(id)
    setExpenses(prev => prev.filter(e => e.id !== id))
  }, [])

  // ─── Balance History + Wallet ──────────────────────────────────────────────

  const addBalance = useCallback(async (entry: Omit<BalanceHistoryEntry, 'id'>) => {
    const { entry: created, wallet: updatedWallet } = await BalanceAPI.addBalance(entry)
    setBalanceHistory(prev => [created, ...prev])
    setWalletState(updatedWallet)
  }, [])

  const updateBalance = useCallback(async (
    id: string,
    entry: Partial<Omit<BalanceHistoryEntry, 'id'>>
  ) => {
    const { entry: updated, wallet: updatedWallet } = await BalanceAPI.updateBalanceHistory(id, entry)
    setBalanceHistory(prev => prev.map(e => (e.id === id ? updated : e)))
    setWalletState(updatedWallet)
  }, [])

  const deleteBalance = useCallback(async (id: string) => {
    const { wallet: updatedWallet } = await BalanceAPI.deleteBalanceHistory(id)
    setBalanceHistory(prev => prev.filter(e => e.id !== id))
    setWalletState(updatedWallet)
  }, [])

  return (
    <AppContext.Provider value={{
      user, token, authLoading, login, register, logout,
      expenses, wallet, balanceHistory, loading,
      addExpense, updateExpense, deleteExpense,
      addBalance, updateBalance, deleteBalance,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)!
