import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorState({
  title = 'Something went wrong',
  description = 'Unable to load data. Please try again.',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
        <AlertTriangle className="w-10 h-10 text-brand-red" strokeWidth={1.5} />
      </div>
      <h3 className="font-heading text-lg font-semibold text-brand-slate mb-2">{title}</h3>
      <p className="text-brand-olive text-sm max-w-xs mb-6">{description}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary text-sm inline-flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
}
