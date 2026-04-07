import { STATUS } from '../../lib/constants';
import { getDaysLeftLabel, cn } from '../../lib/utils';

const statusConfig = {
  [STATUS.SAFE]: {
    label: 'Safe',
    classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  [STATUS.NEAR_EXPIRY]: {
    label: 'Near Expiry',
    classes: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  [STATUS.EXPIRED]: {
    label: 'Expired',
    classes: 'bg-red-50 text-red-700 border-red-200 animate-pulse-soft',
    dot: 'bg-red-500',
  },
  [STATUS.LOW_STOCK]: {
    label: 'Low Stock',
    classes: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
  },
};

export default function ExpiryStatusBadge({ status, daysLeft, showDays = false, size = 'sm' }) {
  const config = statusConfig[status] || statusConfig[STATUS.SAFE];
  const sizeClasses = size === 'lg' ? 'px-3 py-1.5 text-sm' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold border',
        sizeClasses,
        config.classes
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {config.label}
      {showDays && daysLeft !== undefined && (
        <span className="font-normal opacity-80">
          · {getDaysLeftLabel(daysLeft)}
        </span>
      )}
    </span>
  );
}
