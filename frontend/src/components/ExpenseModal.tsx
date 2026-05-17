import { useState, useEffect } from 'react'
import type { Expense, Category, Method } from '../types'
import { today, currentTime, to12Hour, to24Hour } from '../utils'
import { useAppContext } from '../context/AppContext'

interface ExpenseModalProps {
  isOpen: boolean
  editExpense: Expense | null
  onClose: () => void
}

export function ExpenseModal({ isOpen, editExpense, onClose }: ExpenseModalProps) {
  const { addExpense, updateExpense } = useAppContext()

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<Category>('Transport')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(today())
  const [time, setTime] = useState(currentTime())
  const [method, setMethod] = useState<Method>('cash')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (editExpense) {
      setTitle(editExpense.title)
      setCategory(editExpense.category)
      setAmount(String(editExpense.amount))
      setNote(editExpense.note)
      setDate(editExpense.date)
      setTime(to24Hour(editExpense.time))
      setMethod(editExpense.method)
    } else {
      setTitle('')
      setCategory('Transport')
      setAmount('')
      setNote('')
      setDate(today())
      setTime(currentTime())
      setMethod('cash')
    }
    setError('')
  }, [editExpense, isOpen])

  async function handleSave() {
    if (!title || !amount || !date || !time) {
      setError('Please fill all fields')
      return
    }
    setSaving(true)
    setError('')
    try {
      const payload = {
        title,
        category,
        amount: parseFloat(amount),
        note,
        date,
        time: to12Hour(time),
        method,
      }
      if (editExpense) {
        await updateExpense({ id: editExpense.id, ...payload })
      } else {
        await addExpense(payload)
      }
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to save expense')
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 z-40 flex items-end justify-center">
      <div className="bg-white rounded-t-3xl w-full max-w-lg p-5 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-extrabold">{editExpense ? 'Edit Expense' : 'Add Expense'}</h2>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-zinc-400">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Metro, Recharge..."
              className="w-full mt-1 rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none focus:border-green-700"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-zinc-400">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as Category)}
              className="w-full mt-1 rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none"
            >
              <option value="Transport">Transport</option>
              <option value="Food">Food</option>
              <option value="Recharge">Recharge</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-zinc-400">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0"
              className="w-full mt-1 rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-zinc-400">Payment Method</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                onClick={() => setMethod('cash')}
                className={method === 'cash'
                  ? 'border border-orange-400 bg-orange-50 text-orange-700 rounded-xl py-3 font-bold'
                  : 'border border-zinc-300 bg-zinc-50 text-zinc-500 rounded-xl py-3 font-bold'}
              >
                Cash
              </button>
              <button
                onClick={() => setMethod('online')}
                className={method === 'online'
                  ? 'border border-blue-400 bg-blue-50 text-blue-700 rounded-xl py-3 font-bold'
                  : 'border border-zinc-300 bg-zinc-50 text-zinc-500 rounded-xl py-3 font-bold'}
              >
                Online
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase text-zinc-400">Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full mt-1 rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-zinc-400">Time</label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full mt-1 rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-zinc-400">Note</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Write Description.."
              className="w-full mt-1 rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none h-24 resize-none"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-bold py-4 rounded-xl"
          >
            {saving ? 'Saving...' : 'Save Expense'}
          </button>
        </div>
      </div>
    </div>
  )
}
