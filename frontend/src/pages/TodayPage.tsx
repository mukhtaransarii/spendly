import { useAppContext } from '../context/AppContext'
import { ExpenseTable } from '../components/ExpenseTable'
import { formatMoney, today } from '../utils'
import type { Expense } from '../types'

interface TodayPageProps {
  onEdit: (expense: Expense) => void
}

export function TodayPage({ onEdit }: TodayPageProps) {
  const { expenses, deleteExpense } = useAppContext()

  const list = expenses
  .filter(item => item.date === today()).reverse()


  const total = list.reduce((sum, item) => sum + Number(item.amount), 0)

  function handleDelete(id: string) {
    if (!confirm('Delete this expense?')) return
    deleteExpense(id)
  }

  if (list.length === 0) {
    return (
      <div className="text-center text-zinc-400 py-16">No expenses today</div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2 px-1">
        <div className="text-xs font-semibold text-zinc-500">{list.length} Entries</div>
        <div className="mono text-sm font-bold text-green-700">{formatMoney(total)}</div>
      </div>
      <ExpenseTable items={list} onEdit={onEdit} onDelete={handleDelete} />
    </div>
  )
}
