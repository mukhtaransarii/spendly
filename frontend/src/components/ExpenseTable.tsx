import type { Expense, Category } from '../types'
import { formatMoney } from '../utils'

interface ExpenseTableProps {
  items: Expense[]
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
}

function CategoryIcon({ category, className = 'w-5 h-5' }: { category: Category; className?: string }) {
  if (category === 'Transport') return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  )

  if (category === 'Food') return (
    <svg className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.9" d="m4 12 2.66667-1 2.66666 1L12 11l2.6667 1 2.6666-1L20 12m-1 5H5v1c0 1.1046.89543 2 2 2h10c1.1046 0 2-.8954 2-2v-1ZM5 9.00003h14v-1c0-2.20914-1.7909-4-4-4H9c-2.20914 0-4 1.79086-4 4v1ZM18.5 14h-13c-.82843 0-1.5.6716-1.5 1.5 0 .8285.67157 1.5 1.5 1.5h13c.8284 0 1.5-.6715 1.5-1.5 0-.8284-.6716-1.5-1.5-1.5Z" />
    </svg>
  )

  if (category === 'Recharge') return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    </svg>
  )

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m20.893 13.393-1.135-1.135a2.252 2.252 0 0 1-.421-.585l-1.08-2.16a.414.414 0 0 0-.663-.107.827.827 0 0 1-.812.21l-1.273-.363a.89.89 0 0 0-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 0 1-1.81 1.025 1.055 1.055 0 0 1-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 0 1-1.383-2.46l.007-.042a2.25 2.25 0 0 1 .29-.787l.09-.15a2.25 2.25 0 0 1 2.37-1.048l1.178.236a1.125 1.125 0 0 0 1.302-.795l.208-.73a1.125 1.125 0 0 0-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 0 1-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 0 1-1.458-1.137l1.411-2.353a2.25 2.25 0 0 0 .286-.76m11.928 9.869A9 9 0 0 0 8.965 3.525m11.928 9.868A9 9 0 1 1 8.965 3.525" />
    </svg>
  )
}

export function ExpenseTable({ items, onEdit, onDelete }: ExpenseTableProps) {

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
      <table className="w-full table-fixed">
        
        {/* Heading  */}
        <thead className="bg-zinc-50 border-b border-zinc-200">
          <tr className="text-[10px] uppercase tracking-wider text-zinc-500">
            <th className="text-left px-3 py-2 w-[40%]">Title</th>
            <th className="text-left px-3 py-2 w-[18%]">Cat</th>
            <th className="text-right px-3 py-2 w-[12%]">Amt</th>
            <th className="text-center px-3 py-2 w-[30%]">Action</th>
          </tr>
        </thead>

        <tbody>
          {/* Rows */}
          {items.map(item => (
            <tr key={item.id} className="border-b border-zinc-100 hover:bg-zinc-50">
              
              {/* Title */}
              <td className="px-3 py-2">
                <div className="flex gap-2 min-w-0 items-center">
                  <div className={`shrink-0 ${item.method === 'cash' ? 'text-orange-600' : 'text-blue-600'}`}>
                    <CategoryIcon category={item.category} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium truncate leading-none">{item.title}</div>
                    <div className="mono text-[9px] text-zinc-400">{item.time}</div>
                    {item.note && (
                     <div onClick={() => alert(item.note)} className="mono text-[10px] text-zinc-400 truncate max-w-full">{item.note}</div>
                    )}
                  </div>
                </div>
              </td>

              {/* Category */}
              <td className="px-3 py-2 text-[11px] text-zinc-500 font-medium">{item.category}</td>
              
              {/* Amount */}
              <td className={`px-3 py-2 text-right mono text-[13px] font-semibold ${item.method === 'cash' ? 'text-orange-700' : 'text-blue-700'}`}>{formatMoney(item.amount)}</td>

              {/* Actions */}
              <td className="px-3 py-2">
                <div className="flex items-center justify-center gap-1">
                  <button onClick={() => onEdit(item)} className="py-0.5 px-2 text-[10px] font-semibold rounded-md border border-zinc-200 hover:bg-zinc-100">
                    Edit
                  </button>
                  <button onClick={() => onDelete(item.id)} className="py-0.5 px-2 text-[10px] font-semibold rounded-md border border-red-200 text-red-600 hover:bg-red-50">
                    Del
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
