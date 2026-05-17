import { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { formatDate, formatMoney } from '../utils'
import type { BalanceHistoryEntry } from '../types'

interface BalanceHistoryModalProps {
  isOpen: boolean
  onClose: () => void
}

export function BalanceHistoryModal({ isOpen, onClose }: BalanceHistoryModalProps) {
  const { balanceHistory, updateBalance, deleteBalance } = useAppContext()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editCash, setEditCash] = useState('')
  const [editOnline, setEditOnline] = useState('')
  const [editNote, setEditNote] = useState('')
  const [saving, setSaving] = useState(false)

  function startEdit(item: BalanceHistoryEntry) {
    setEditingId(item.id)
    setEditCash(String(item.cash))
    setEditOnline(String(item.online))
    setEditNote(item.note)
  }

  function cancelEdit() {
    setEditingId(null)
  }

  async function handleUpdate(id: string) {
    setSaving(true)
    try {
      await updateBalance(id, {
        cash: parseFloat(editCash) || 0,
        online: parseFloat(editOnline) || 0,
        note: editNote,
      })
      setEditingId(null)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this balance entry? This will reverse the amount from your wallet.')) return
    await deleteBalance(id)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center">
      <div className="bg-white rounded-t-3xl w-full max-w-lg p-5 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-extrabold">Balance History</h2>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center">
            ✕
          </button>
        </div>

        {balanceHistory.length === 0 ? (
          <div className="text-center text-zinc-400 py-10">No balance history</div>
        ) : (
          balanceHistory.map(item => (
            <div key={item.id} className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 mb-3">
              {editingId === item.id ? (
                // ── Edit mode ──
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-zinc-400">Cash</label>
                      <input
                        type="number"
                        value={editCash}
                        onChange={e => setEditCash(e.target.value)}
                        className="w-full mt-1 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-zinc-400">Online</label>
                      <input
                        type="number"
                        value={editOnline}
                        onChange={e => setEditOnline(e.target.value)}
                        className="w-full mt-1 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-zinc-400">Note</label>
                    <input
                      type="text"
                      value={editNote}
                      onChange={e => setEditNote(e.target.value)}
                      className="w-full mt-1 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(item.id)}
                      disabled={saving}
                      className="flex-1 bg-green-700 text-white text-sm font-bold py-2 rounded-xl disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex-1 border border-zinc-300 text-zinc-500 text-sm font-bold py-2 rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // ── View mode ──
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-sm">{formatDate(item.date)}</div>
                      <div className="mono text-xs text-zinc-400">{item.time}</div>
                    </div>
                    <div className="text-right">
                      {item.cash ? <div className="mono text-orange-700">+ {formatMoney(item.cash)} Cash</div> : null}
                      {item.online ? <div className="mono text-blue-700">+ {formatMoney(item.online)} Online</div> : null}
                    </div>
                  </div>
                  {item.note ? <div className="text-xs text-zinc-500 mt-2 italic">{item.note}</div> : null}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => startEdit(item)}
                      className="py-1 px-3 text-xs font-semibold rounded-lg border border-zinc-200 hover:bg-zinc-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="py-1 px-3 text-xs font-semibold rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
