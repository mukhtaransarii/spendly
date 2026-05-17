import { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { today, currentTime, to12Hour } from '../utils'

interface WalletModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { addBalance } = useAppContext()
  const [cash, setCash] = useState('')
  const [online, setOnline] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(today())
  const [time, setTime] = useState(currentTime())
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    const cashAmount = parseFloat(cash) || 0
    const onlineAmount = parseFloat(online) || 0
    if (!cashAmount && !onlineAmount) {
      setError('Enter at least one amount')
      return
    }
    setSaving(true)
    setError('')
    try {
      await addBalance({ cash: cashAmount, online: onlineAmount, note, date, time: to12Hour(time) })
      setCash('')
      setOnline('')
      setNote('')
      setDate(today())
      setTime(currentTime())
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to add balance')
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 z-40 flex items-end justify-center">
      <div className="bg-white rounded-t-3xl w-full max-w-lg p-5 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-extrabold">Add Balance</h2>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-zinc-400">Cash Amount</label>
            <input
              type="number"
              value={cash}
              onChange={e => setCash(e.target.value)}
              placeholder="0"
              className="w-full mt-1 rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-zinc-400">Online Amount</label>
            <input
              type="number"
              value={online}
              onChange={e => setOnline(e.target.value)}
              placeholder="0"
              className="w-full mt-1 rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none"
            />
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
              placeholder="Salary, Added Cash, Bank Transfer..."
              className="w-full mt-1 rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none h-20 resize-none"
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
            {saving ? 'Saving...' : 'Save Balance'}
          </button>
        </div>
      </div>
    </div>
  )
}
