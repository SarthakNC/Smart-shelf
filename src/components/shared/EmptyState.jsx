import { PackageOpen } from 'lucide-react';

export default function EmptyState({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'Try adjusting your search or filters.',
  action,
  actionLabel = 'Add Item',
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-brand-warm flex items-center justify-center mb-5">
        <Icon className="w-10 h-10 text-brand-orange" strokeWidth={1.5} />
      </div>
      <h3 className="font-heading text-lg font-semibold text-brand-slate mb-2">{title}</h3>
      <p className="text-brand-olive text-sm max-w-xs mb-6">{description}</p>
      {action && (
        <button onClick={action} className="btn-primary text-sm">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
