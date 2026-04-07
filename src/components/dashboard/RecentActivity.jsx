import { Activity, Plus, ShoppingCart, FileText, Trash2, Tag } from 'lucide-react';
import { MOCK_ACTIVITY } from '../../lib/mock-data';
import { cn } from '../../lib/utils';

const iconMap = {
  add: { icon: Plus, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  sold: { icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-50' },
  import: { icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50' },
  sale: { icon: Tag, color: 'text-amber-500', bg: 'bg-amber-50' },
  delete: { icon: Trash2, color: 'text-red-500', bg: 'bg-red-50' },
};

export default function RecentActivity() {
  return (
    <div className="card-base">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
          <Activity className="w-4 h-4 text-purple-600" />
        </div>
        <h3 className="section-title">Recent Activity</h3>
      </div>

      <div className="space-y-3">
        {MOCK_ACTIVITY.map((activity, idx) => {
          const config = iconMap[activity.type] || iconMap.add;
          const Icon = config.icon;
          return (
            <div key={activity.id} className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: `${idx * 60}ms` }}>
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', config.bg)}>
                <Icon className={cn('w-4 h-4', config.color)} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-brand-slate">{activity.action}</p>
                <p className="text-xs text-brand-olive">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
