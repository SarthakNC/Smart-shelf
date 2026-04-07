import { Trash2, CheckSquare, Square, Edit3 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState } from 'react';

function ConfidenceBadge({ confidence }) {
  const pct = Math.round(confidence * 100);
  let cls = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (pct < 70) cls = 'bg-amber-50 text-amber-700 border-amber-200';
  if (pct < 50) cls = 'bg-red-50 text-red-700 border-red-200';

  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border', cls)}>
      {pct}%
    </span>
  );
}

export default function ParsedInvoiceTable({ rows, onToggleRow, onRemoveRow, onUpdateRow }) {
  return (
    <div className="card-base !p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="py-3 px-4 text-left text-xs font-semibold text-brand-olive uppercase tracking-wider w-8"></th>
              <th className="py-3 px-3 text-left text-xs font-semibold text-brand-olive uppercase tracking-wider">Item Name</th>
              <th className="py-3 px-3 text-center text-xs font-semibold text-brand-olive uppercase tracking-wider">Qty</th>
              <th className="py-3 px-3 text-center text-xs font-semibold text-brand-olive uppercase tracking-wider">Unit</th>
              <th className="py-3 px-3 text-center text-xs font-semibold text-brand-olive uppercase tracking-wider hidden sm:table-cell">Cost (₹)</th>
              <th className="py-3 px-3 text-center text-xs font-semibold text-brand-olive uppercase tracking-wider">Confidence</th>
              <th className="py-3 px-3 text-center text-xs font-semibold text-brand-olive uppercase tracking-wider w-10"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={row.id}
                className={cn(
                  'border-b border-gray-50 transition-all animate-fade-in',
                  row.isSelected ? 'bg-white' : 'bg-gray-50/50 opacity-60'
                )}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <td className="py-3 px-4">
                  <button
                    onClick={() => onToggleRow(row.id)}
                    className="text-brand-olive hover:text-brand-green transition-colors"
                    aria-label={row.isSelected ? 'Deselect' : 'Select'}
                  >
                    {row.isSelected ? (
                      <CheckSquare className="w-5 h-5 text-brand-green" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                </td>
                <td className="py-3 px-3">
                  <input
                    type="text"
                    value={row.itemName}
                    onChange={(e) => onUpdateRow(row.id, 'itemName', e.target.value)}
                    className="text-sm font-medium text-brand-slate bg-transparent border-b border-transparent hover:border-gray-300 focus:border-brand-green focus:outline-none py-0.5 w-full transition-colors"
                  />
                </td>
                <td className="py-3 px-3 text-center">
                  <input
                    type="number"
                    min="1"
                    value={row.quantity}
                    onChange={(e) => onUpdateRow(row.id, 'quantity', parseInt(e.target.value) || 0)}
                    className="text-sm text-center font-medium text-brand-slate bg-transparent border-b border-transparent hover:border-gray-300 focus:border-brand-green focus:outline-none py-0.5 w-16 mx-auto transition-colors"
                  />
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="text-sm text-brand-olive">{row.unit}</span>
                </td>
                <td className="py-3 px-3 text-center hidden sm:table-cell">
                  <span className="text-sm text-brand-olive">{row.costPrice ? `₹${row.costPrice}` : '—'}</span>
                </td>
                <td className="py-3 px-3 text-center">
                  <ConfidenceBadge confidence={row.confidence} />
                </td>
                <td className="py-3 px-3 text-center">
                  <button
                    onClick={() => onRemoveRow(row.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Remove row"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
