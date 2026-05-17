import { useAppContext } from '../context/AppContext'
import { ExpenseTable } from '../components/ExpenseTable'
import { formatDate, formatMoney } from '../utils'
import type { Expense } from '../types'

interface HistoryPageProps {
  onEdit: (expense: Expense) => void
}

export function HistoryPage({ onEdit }: HistoryPageProps) {
  const { expenses, deleteExpense } = useAppContext()

  const sorted = [...expenses].sort(
    (a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time)
  )

  function handleDelete(id: string) {
    if (!confirm('Delete this expense?')) return
    deleteExpense(id)
  }

  if (sorted.length === 0) {
    return (
      <div className="text-center text-zinc-400 py-16">No expenses yet</div>
    )
  }

  // Group by date
  const grouped: Record<string, Expense[]> = {}
  sorted.forEach(item => {
    if (!grouped[item.date]) grouped[item.date] = []
    grouped[item.date].push(item)
  })

  return (
    <div>
      {Object.keys(grouped).map(date => {
        const items = grouped[date]
        const total = items.reduce((sum, item) => sum + Number(item.amount), 0)
        return (
          <div key={date} className="mb-5">
            <div className="flex justify-between items-center mb-2 px-1">
              <div className="text-xs font-bold text-zinc-500">{formatDate(date)}</div>
              <div className="mono text-sm font-bold text-green-700">{formatMoney(total)}</div>
            </div>
            <ExpenseTable items={items} onEdit={onEdit} onDelete={handleDelete} />
          </div>
        )
      })}
    </div>
  )
}
