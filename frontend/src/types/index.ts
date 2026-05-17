export type Category = 'Transport' | 'Food' | 'Recharge' | 'Other'
export type Method = 'cash' | 'online'

export interface Expense {
  id: string
  title: string
  category: Category
  amount: number
  note: string
  date: string
  time: string
  method: Method
}

export interface Wallet {
  cash: number
  online: number
}

export interface BalanceHistoryEntry {
  id: string   // added — maps to _id from backend
  cash: number
  online: number
  note: string
  date: string
  time: string
}

export interface User {
  _id: string
  name: string
  email: string
}

export interface AppContextType {
  // auth
  user: User | null
  token: string | null
  authLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void

  // data
  expenses: Expense[]
  wallet: Wallet
  balanceHistory: BalanceHistoryEntry[]
  loading: boolean

  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>
  updateExpense: (expense: Expense) => Promise<void>
  deleteExpense: (id: string) => Promise<void>
  addBalance: (entry: Omit<BalanceHistoryEntry, 'id'>) => Promise<void>
  updateBalance: (id: string, entry: Partial<Omit<BalanceHistoryEntry, 'id'>>) => Promise<void>
  deleteBalance: (id: string) => Promise<void>
}
