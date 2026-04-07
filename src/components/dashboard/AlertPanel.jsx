import { AlertTriangle, Clock, ArrowRight } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import ExpiryStatusBadge from '../shared/ExpiryStatusBadge';
import { getDaysUntilExpiry, formatDate, cn } from '../../lib/utils';
import { STATUS } from '../../lib/constants';
import { Link } from 'react-router-dom';

export default function AlertPanel() {
  const { alerts } = useInventory();

  const nearExpiryAlerts = alerts.filter(a => a.type === 'near_expiry');
  const expiredAlerts = alerts.filter(a => a.type === 'expired');

  if (alerts.length === 0) {
    return (
      <div className="card-base">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="section-title">Alerts</h3>
        </div>
        <div className="text-center py-6">
          <p className="text-sm text-brand-olive">All clear! No items need attention right now.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-base">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <h3 className="section-title">Expiry Alerts</h3>
          <span className="ml-1 px-2 py-0.5 rounded-full bg-brand-red text-white text-xs font-bold">
            {alerts.length}
          </span>
        </div>
        <Link to="/inventory" className="text-xs text-brand-green font-medium hover:underline flex items-center gap-1">
          View All <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Expired items */}
      {expiredAlerts.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-2">
            Expired ({expiredAlerts.length})
          </p>
          <div className="space-y-2">
            {expiredAlerts.slice(0, 3).map(alert => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-3 rounded-xl bg-red-50 border border-red-100 animate-fade-in"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse-soft flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-brand-slate truncate">{alert.item.name}</p>
                    <p className="text-xs text-red-600">{alert.item.quantity} {alert.item.unit} remaining</p>
                  </div>
                </div>
                <ExpiryStatusBadge status={STATUS.EXPIRED} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Near-expiry items */}
      {nearExpiryAlerts.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2">
            Expiring Soon ({nearExpiryAlerts.length})
          </p>
          <div className="space-y-2">
            {nearExpiryAlerts.slice(0, 5).map(alert => {
              const daysLeft = getDaysUntilExpiry(alert.item.expiryDate);
              return (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-amber-50/50 border border-amber-100 animate-fade-in"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                      'w-2 h-2 rounded-full flex-shrink-0',
                      daysLeft <= 2 ? 'bg-amber-500 animate-pulse-soft' : 'bg-amber-400'
                    )} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-brand-slate truncate">{alert.item.name}</p>
                      <div className="flex items-center gap-2 text-xs text-brand-olive">
                        <Clock className="w-3 h-3" />
                        <span>{daysLeft} day{daysLeft !== 1 ? 's' : ''} left</span>
                        <span>·</span>
                        <span>{alert.item.quantity} {alert.item.unit}</span>
                      </div>
                    </div>
                  </div>
                  <ExpiryStatusBadge status={STATUS.NEAR_EXPIRY} daysLeft={daysLeft} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
