import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading...', fullPage = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 py-16 animate-fade-in">
      <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
      <p className="text-sm text-brand-olive font-medium">{message}</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        {content}
      </div>
    );
  }
  return content;
}
