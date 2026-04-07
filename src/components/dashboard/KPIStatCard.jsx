import { cn } from '../../lib/utils';

export default function KPIStatCard({ icon: Icon, label, value, sub, color = 'green', trend }) {
  const colorMap = {
    green: { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-100' },
    orange: { bg: 'bg-amber-50', icon: 'text-amber-600', border: 'border-amber-100' },
    red: { bg: 'bg-red-50', icon: 'text-red-600', border: 'border-red-100' },
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-100' },
    slate: { bg: 'bg-gray-50', icon: 'text-brand-slate', border: 'border-gray-100' },
  };
  const c = colorMap[color] || colorMap.green;

  return (
    <div className={cn(
      'card-base flex items-start gap-4 animate-fade-in group',
      'hover:translate-y-[-2px]'
    )}>
      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', c.bg)}>
        <Icon className={cn('w-6 h-6', c.icon)} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-brand-olive font-medium">{label}</p>
        <p className="text-2xl font-heading font-bold text-brand-slate mt-0.5">{value}</p>
        {sub && <p className="text-xs text-brand-olive mt-1 truncate">{sub}</p>}
        {trend && (
          <p className={cn(
            'text-xs font-medium mt-1',
            trend > 0 ? 'text-red-500' : 'text-emerald-500'
          )}>
            {trend > 0 ? `↑ ${trend} more than yesterday` : `↓ ${Math.abs(trend)} fewer`}
          </p>
        )}
      </div>
    </div>
  );
}
