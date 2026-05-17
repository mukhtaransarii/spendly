import { useState } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import { useAppContext } from './context/AppContext'
import { ExpenseModal } from './components/ExpenseModal'
import { WalletModal } from './components/WalletModal'
import { BalanceHistoryModal } from './components/BalanceHistoryModal'
import { TodayPage } from './pages/TodayPage'
import { HistoryPage } from './pages/HistoryPage'
import { AuthPage } from './pages/AuthPage'
import type { Expense } from './types'
import { formatDate, formatMoney, today } from './utils'

import { migrateLocalData } from './utils/migrate'


export default function App() {
  const { expenses, wallet, user, authLoading, loading, logout } = useAppContext()
  const [expenseModalOpen, setExpenseModalOpen] = useState(false)
  const [walletModalOpen, setWalletModalOpen] = useState(false)
  const [balanceHistoryOpen, setBalanceHistoryOpen] = useState(false)
  const [editExpense, setEditExpense] = useState<Expense | null>(null)
  const [showAmount, setShowAmount] = useState(() => localStorage.getItem('showAmount') !== 'false')

  function openAddExpense() { setEditExpense(null); setExpenseModalOpen(true) }
  function openEditExpense(expense: Expense) { setEditExpense(expense); setExpenseModalOpen(true) }

  const toggleAmount = () => {
    localStorage.setItem('showAmount', String(!showAmount))
    setShowAmount(!showAmount)
  }
  const money = (amount: number) => showAmount ? formatMoney(amount) : '••••'

  // ── Auth loading splash ──────────────────────────────────────────────────
  if (authLoading) return
    
  // ── Not logged in ────────────────────────────────────────────────────────
  if (!user) return <AuthPage />

  // ── Data loading after login ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f5f4f0' }}>
        <div className="text-zinc-400 text-sm">Loading your data...</div>
      </div>
    )
  }
  
  // Inside App component, check if local data exists
  const hasLocalData = !!localStorage.getItem('expenses') || !!localStorage.getItem('wallet')


  const cashSpent = expenses.filter(e => e.method === 'cash').reduce((s, e) => s + Number(e.amount), 0)
  const onlineSpent = expenses.filter(e => e.method === 'online').reduce((s, e) => s + Number(e.amount), 0)
  const cashRemaining = wallet.cash - cashSpent
  const onlineRemaining = wallet.online - onlineSpent
  const grandBalance = wallet.cash + wallet.online
  const grandSpent = cashSpent + onlineSpent
  const grandRemaining = grandBalance - grandSpent
  const uniqueDays = Math.max(new Set(expenses.map(e => e.date)).size, 1)

  return (
    <div className="text-zinc-900 min-h-screen" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#f5f4f0' }}>
      {/* Header */}
      <div className="bg-white border-b border-zinc-200 px-4 py-2 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">Expense</h1>
          <div className="mono text-[10px] text-zinc-400">{formatDate(today())}</div>
        </div>
        <div className="flex items-center gap-2">
          {/* Show/hide amounts */}
          <button onClick={toggleAmount} className="w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-500 hover:bg-zinc-200">
            {showAmount
              ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
              : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
            }
          </button>

          {/* Balance history */}
          <button onClick={() => setBalanceHistoryOpen(true)} className="w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-500 hover:bg-zinc-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
          </button>

          {/* Add balance */}
          <button onClick={() => setWalletModalOpen(true)} className="bg-green-700 hover:bg-green-800 text-white text-xs font-bold px-3 py-2 rounded-full flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Add Balance
          </button>

          {/* Logout */}
          <button onClick={logout} title={`Logout ${user.name}`} className="w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" /></svg>
          </button>
        </div>
      </div>

      {/* Wallet Cards */}
      <div className="grid grid-cols-3 gap-3 p-4">
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-[12px] uppercase tracking-widest font-bold text-orange-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" /></svg>
            Cash
          </div>
          <div className="mono text-xl">{money(cashRemaining)}</div>
          <div className="mt-3 space-y-1 text-[10px]">
            <div className="flex justify-between"><span className="text-zinc-500">Bal</span><span className="mono">{money(wallet.cash)}</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Spent</span><span className="mono text-red-600">- {money(cashSpent)}</span></div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-[12px] uppercase tracking-widest font-bold text-blue-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>
            Online
          </div>
          <div className="mono text-xl">{money(onlineRemaining)}</div>
          <div className="mt-3 space-y-1 text-[10px]">
            <div className="flex justify-between"><span className="text-zinc-500">Bal</span><span className="mono">{money(wallet.online)}</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Spent</span><span className="mono text-red-600">- {money(onlineSpent)}</span></div>
          </div>
        </div>

        <div className="bg-white border border-blue-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-[12px] uppercase tracking-widest font-bold text-green-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
            GT
          </div>
          <div className="mono text-xl">{money(grandRemaining)}</div>
          <div className="mt-3 space-y-1 text-[10px]">
            <div className="flex justify-between"><span className="text-zinc-500">Bal</span><span className="mono">{money(grandBalance)}</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Spent</span><span className="mono text-red-600">- {money(grandSpent)}</span></div>
          </div>
        </div>
      </div>

      {/* Average Spend */}
      {uniqueDays > 1 &&
        <div className="mx-4 mb-3 bg-yellow-50 border border-yellow-200 text-yellow-500 rounded-2xl px-3 py-2 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
            Daily Spend
          </div>
          <div className="text-right">
            <div className="text-sm font-bold">{money(grandSpent / (uniqueDays || 1))}</div>
            <div className="text-[10px]">based on {uniqueDays} day(s)</div>
          </div>
        </div>
      }

      {hasLocalData && (
        <div className="mx-4 mt-3 bg-yellow-50 border border-yellow-300 rounded-2xl px-4 py-3 flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-yellow-800">Local data found</div>
            <div className="text-xs text-yellow-600">Import your old expenses to the database</div>
          </div>
          <button
            onClick={async () => {
              if (!confirm('Import all local data to your account?')) return
              await migrateLocalData()
              window.location.reload() // reload to fetch fresh data from DB
            }}
            className="bg-yellow-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
          >
            Import
          </button>
        </div>
      )}

      {/* Nav */}
      <nav className="sticky top-4 z-20 mx-4 mb-4 flex gap-1 bg-white border border-zinc-200 rounded-2xl p-1 shadow-sm">
        <NavLink to="/" end className={({ isActive }) => `flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${isActive ? 'bg-green-700 text-white shadow-sm' : 'bg-transparent text-zinc-500 hover:bg-zinc-50'}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          Today
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => `flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${isActive ? 'bg-green-700 text-white shadow-sm' : 'bg-transparent text-zinc-500 hover:bg-zinc-50'}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          History
        </NavLink>
      </nav>

      {/* Pages */}
      <div className="px-4 pb-28">
        <Routes>
          <Route path="/" element={<><div className="text-[11px] uppercase tracking-widest font-bold text-zinc-400 mb-3">Today's Expenses</div><TodayPage onEdit={openEditExpense} /></>} />
          <Route path="/history" element={<><div className="text-[11px] uppercase tracking-widest font-bold text-zinc-400 mb-3">Expense History</div><HistoryPage onEdit={openEditExpense} /></>} />
        </Routes>
      </div>

      {/* FAB */}
      <button onClick={openAddExpense} className="fixed bottom-6 right-5 w-14 h-14 rounded-full bg-green-700 hover:bg-green-800 text-white shadow-xl flex items-center justify-center z-30">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
      </button>

      {/* Modals */}
      <ExpenseModal isOpen={expenseModalOpen} editExpense={editExpense} onClose={() => setExpenseModalOpen(false)} />
      <WalletModal isOpen={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
      <BalanceHistoryModal isOpen={balanceHistoryOpen} onClose={() => setBalanceHistoryOpen(false)} />
    </div>
  )
}
