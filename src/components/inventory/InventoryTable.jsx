import { Edit3, Trash2, Minus, ShoppingCart } from 'lucide-react';
import ExpiryStatusBadge from '../shared/ExpiryStatusBadge';
import { formatDate, getDaysLeftLabel, formatCurrency, cn } from '../../lib/utils';

export default function InventoryTable({ items, onEdit, onDelete, onMarkSold }) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-semibold text-brand-olive uppercase tracking-wider py-3 px-4">Item</th>
              <th className="text-left text-xs font-semibold text-brand-olive uppercase tracking-wider py-3 px-3">Category</th>
              <th className="text-center text-xs font-semibold text-brand-olive uppercase tracking-wider py-3 px-3">Qty</th>
              <th className="text-left text-xs font-semibold text-brand-olive uppercase tracking-wider py-3 px-3">Expiry</th>
              <th className="text-center text-xs font-semibold text-brand-olive uppercase tracking-wider py-3 px-3">Status</th>
              <th className="text-right text-xs font-semibold text-brand-olive uppercase tracking-wider py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr
                key={item.id}
                className="border-b border-gray-50 hover:bg-brand-warm/30 transition-colors animate-fade-in"
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                <td className="py-3 px-4">
                  <p className="text-sm font-medium text-brand-slate">{item.name}</p>
                  <p className="text-xs text-brand-olive">{formatCurrency(item.sellingPrice || 0)} per {item.unit}</p>
                </td>
                <td className="py-3 px-3">
                  <span className="text-xs font-medium text-brand-olive bg-gray-100 px-2 py-1 rounded-lg">{item.category}</span>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className={cn(
                    'text-sm font-semibold',
                    item.quantity <= 5 ? 'text-red-600' : 'text-brand-slate'
                  )}>
                    {item.quantity} {item.unit}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <p className="text-sm text-brand-slate">{formatDate(item.expiryDate)}</p>
                  <p className={cn(
                    'text-xs font-medium',
                    item.daysLeft <= 0 ? 'text-red-600' : item.daysLeft <= 7 ? 'text-amber-600' : 'text-emerald-600'
                  )}>
                    {getDaysLeftLabel(item.daysLeft)}
                  </p>
                </td>
                <td className="py-3 px-3 text-center">
                  <ExpiryStatusBadge status={item.status} daysLeft={item.daysLeft} />
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 rounded-lg hover:bg-blue-50 text-brand-olive hover:text-blue-600 transition-colors"
                      title="Edit"
                      aria-label={`Edit ${item.name}`}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onMarkSold(item)}
                      className="p-2 rounded-lg hover:bg-emerald-50 text-brand-olive hover:text-emerald-600 transition-colors"
                      title="Mark Sold"
                      aria-label={`Mark ${item.name} sold`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(item)}
                      className="p-2 rounded-lg hover:bg-red-50 text-brand-olive hover:text-red-600 transition-colors"
                      title="Delete"
                      aria-label={`Delete ${item.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="card-base animate-fade-in"
            style={{ animationDelay: `${idx * 40}ms` }}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-brand-slate truncate">{item.name}</p>
                <p className="text-xs text-brand-olive mt-0.5">{item.category} · {formatCurrency(item.sellingPrice || 0)}</p>
              </div>
              <ExpiryStatusBadge status={item.status} />
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <p className="text-[10px] uppercase text-brand-olive font-medium">Quantity</p>
                <p className={cn('text-sm font-semibold', item.quantity <= 5 ? 'text-red-600' : 'text-brand-slate')}>
                  {item.quantity} {item.unit}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-brand-olive font-medium">Expiry</p>
                <p className="text-sm font-medium text-brand-slate">{formatDate(item.expiryDate)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-brand-olive font-medium">Days Left</p>
                <p className={cn(
                  'text-sm font-semibold',
                  item.daysLeft <= 0 ? 'text-red-600' : item.daysLeft <= 7 ? 'text-amber-600' : 'text-emerald-600'
                )}>
                  {getDaysLeftLabel(item.daysLeft)}
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <button onClick={() => onEdit(item)} className="btn-ghost text-xs flex-1 flex items-center justify-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
              <button onClick={() => onMarkSold(item)} className="btn-ghost text-xs flex-1 flex items-center justify-center gap-1.5 text-emerald-600">
                <ShoppingCart className="w-3.5 h-3.5" /> Sold
              </button>
              <button onClick={() => onDelete(item)} className="btn-ghost text-xs flex-1 flex items-center justify-center gap-1.5 text-red-500">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
