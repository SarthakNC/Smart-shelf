import { CheckCircle, Circle, AlertTriangle, Tag, Trash2 } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { STATUS } from '../../lib/constants';

export default function TodaysActions() {
  const { items, alerts } = useInventory();

  const expired = items.filter(i => i.status === STATUS.EXPIRED);
  const nearExpiry = items.filter(i => i.status === STATUS.NEAR_EXPIRY);
  const lowStock = items.filter(i => i.quantity <= 5 && i.status !== STATUS.EXPIRED);

  const actions = [];

  if (expired.length > 0) {
    actions.push({
      id: 'remove-expired',
      icon: Trash2,
      text: `Remove ${expired.length} expired item${expired.length > 1 ? 's' : ''} from shelf`,
      priority: 'high',
      done: false,
    });
  }

  if (nearExpiry.length > 0) {
    actions.push({
      id: 'discount-nearexpiry',
      icon: Tag,
      text: `Set discounts on ${nearExpiry.length} near-expiry item${nearExpiry.length > 1 ? 's' : ''}`,
      priority: 'medium',
      done: false,
    });
  }

  if (lowStock.length > 0) {
    actions.push({
      id: 'reorder-lowstock',
      icon: AlertTriangle,
      text: `Reorder ${lowStock.length} low-stock item${lowStock.length > 1 ? 's' : ''}`,
      priority: 'low',
      done: false,
    });
  }

  actions.push({
    id: 'daily-check',
    icon: CheckCircle,
    text: 'Do daily shelf check for new arrivals',
    priority: 'info',
    done: false,
  });

  const priorityColors = {
    high: 'text-red-500',
    medium: 'text-amber-500',
    low: 'text-blue-500',
    info: 'text-gray-400',
  };

  return (
    <div className="card-base">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-brand-green/10 flex items-center justify-center">
          <CheckCircle className="w-4 h-4 text-brand-green" />
        </div>
        <h3 className="section-title">Today's Actions</h3>
      </div>

      <div className="space-y-3">
        {actions.map(action => (
          <div key={action.id} className="flex items-start gap-3 group cursor-pointer">
            <div className="mt-0.5 flex-shrink-0">
              <Circle className={`w-5 h-5 ${priorityColors[action.priority]} group-hover:hidden`} />
              <CheckCircle className={`w-5 h-5 text-emerald-500 hidden group-hover:block`} />
            </div>
            <p className="text-sm text-brand-slate group-hover:line-through group-hover:text-brand-olive transition-all">
              {action.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
