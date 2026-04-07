import { Clock, Tag, AlertTriangle, Check, X } from 'lucide-react';
import { formatDate, formatCurrency, getDaysLeftLabel, cn } from '../../lib/utils';

export default function FlashSaleCard({ suggestion, onReview, onCreateSale, onDismiss }) {
  const urgencyConfig = {
    critical: { bg: 'bg-gradient-to-br from-red-50 to-red-100/60', border: 'border-red-200', badge: 'bg-red-100 text-red-700', label: 'CRITICAL' },
    high: { bg: 'bg-gradient-to-br from-amber-50 to-orange-50/60', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', label: 'HIGH' },
    medium: { bg: 'bg-gradient-to-br from-yellow-50 to-amber-50/40', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-700', label: 'MEDIUM' },
    low: { bg: 'bg-gradient-to-br from-emerald-50 to-green-50/40', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', label: 'LOW' },
  };

  const cfg = urgencyConfig[suggestion.urgency] || urgencyConfig.low;

  return (
    <div className={cn('rounded-2xl border p-5 transition-all duration-200 hover:shadow-card-hover animate-fade-in', cfg.bg, cfg.border)}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h4 className="text-base font-heading font-semibold text-brand-slate truncate">{suggestion.name}</h4>
          <div className="flex items-center gap-2 mt-1 text-sm text-brand-olive">
            <Clock className="w-3.5 h-3.5" />
            <span>{getDaysLeftLabel(suggestion.daysLeft)}</span>
            <span>·</span>
            <span>{suggestion.quantity} {suggestion.unit}</span>
          </div>
        </div>
        <span className={cn('px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide', cfg.badge)}>
          {cfg.label}
        </span>
      </div>

      {/* Discount suggestion */}
      <div className="flex items-center gap-4 mb-4 p-3 bg-white/70 rounded-xl border border-white">
        <div className="text-center">
          <p className="text-3xl font-heading font-bold text-brand-orange">{suggestion.suggestedDiscount}%</p>
          <p className="text-[10px] uppercase text-brand-olive font-medium tracking-wider">Discount</p>
        </div>
        <div className="flex-1 border-l border-gray-200 pl-4">
          <p className="text-sm text-brand-slate">
            <span className="line-through text-brand-olive">{formatCurrency(suggestion.sellingPrice)}</span>
            {' → '}
            <span className="font-bold text-brand-green">{formatCurrency(suggestion.discountedPrice)}</span>
          </p>
          <p className="text-xs text-brand-olive mt-1">Expires: {formatDate(suggestion.expiryDate)}</p>
        </div>
      </div>

      {/* Reason */}
      <p className="text-sm text-brand-olive mb-4 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500" />
        {suggestion.reason}
      </p>

      {/* Potential loss */}
      <div className="text-xs text-brand-olive mb-4">
        Potential loss if unsold: <span className="font-semibold text-brand-red">{formatCurrency(suggestion.potentialLoss)}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onCreateSale(suggestion)}
          className="btn-primary text-xs flex-1 flex items-center justify-center gap-1.5"
        >
          <Tag className="w-3.5 h-3.5" /> Create Sale
        </button>
        <button
          onClick={() => onReview(suggestion)}
          className="btn-secondary text-xs flex items-center justify-center gap-1.5 px-3"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDismiss(suggestion)}
          className="btn-ghost text-xs flex items-center justify-center gap-1.5 px-3"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
