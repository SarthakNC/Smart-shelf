import { Zap, ArrowRight } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { getDaysUntilExpiry, getDiscountForDaysLeft, formatCurrency, cn } from '../../lib/utils';
import { STATUS } from '../../lib/constants';
import { Link } from 'react-router-dom';

export default function FlashSalePreview() {
  const { items } = useInventory();

  const suggestions = items
    .filter(i => {
      const d = getDaysUntilExpiry(i.expiryDate);
      return d > 0 && d <= 7;
    })
    .map(i => ({
      ...i,
      daysLeft: getDaysUntilExpiry(i.expiryDate),
      discount: getDiscountForDaysLeft(getDaysUntilExpiry(i.expiryDate)),
    }))
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 3);

  return (
    <div className="card-base">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-orange/10 flex items-center justify-center">
            <Zap className="w-4 h-4 text-brand-orange" />
          </div>
          <h3 className="section-title">Flash Sale Ideas</h3>
        </div>
        <Link to="/flash-sales" className="text-xs text-brand-green font-medium hover:underline flex items-center gap-1">
          View All <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {suggestions.length === 0 ? (
        <p className="text-sm text-brand-olive text-center py-4">No items need discounting right now.</p>
      ) : (
        <div className="space-y-3">
          {suggestions.map(item => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-amber-50/80 to-orange-50/50 border border-amber-100"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-brand-slate truncate">{item.name}</p>
                <p className="text-xs text-brand-olive">{item.daysLeft} day{item.daysLeft !== 1 ? 's' : ''} left · {item.quantity} {item.unit}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={cn(
                  'px-2.5 py-1 rounded-lg text-sm font-bold',
                  item.discount >= 25
                    ? 'bg-red-100 text-red-700'
                    : item.discount >= 15
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                )}>
                  {item.discount}% off
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
