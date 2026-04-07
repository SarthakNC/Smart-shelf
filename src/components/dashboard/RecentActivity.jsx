import { Activity, Plus, ShoppingCart, FileText, Trash2, Tag } from 'lucide-react';
import { cn } from '../../lib/utils';

const MOCK_ACTIVITY = [
  { id: '1', action: 'Added 20 pkt of Amul Milk', time: '2 hours ago', type: 'add' },
  { id: '2', action: 'Marked 5 Yakult as sold', time: '3 hours ago', type: 'sold' },
  { id: '3', action: 'Imported invoice #INV-0846', time: 'Yesterday', type: 'import' },
  { id: '4', action: 'Created flash sale for Bread', time: 'Yesterday', type: 'sale' },
  { id: '5', action: 'Deleted expired Nestle Milk Powder', time: '2 days ago', type: 'delete' },
];

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
