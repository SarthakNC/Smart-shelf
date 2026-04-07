import { Info } from 'lucide-react';

const DISCOUNT_RULES = [
  { days: '7 days left', discount: '10%', color: 'bg-emerald-100 text-emerald-700' },
  { days: '5 days left', discount: '15%', color: 'bg-yellow-100 text-yellow-700' },
  { days: '3 days left', discount: '25%', color: 'bg-amber-100 text-amber-700' },
  { days: '1 day left', discount: '40%', color: 'bg-red-100 text-red-700' },
];

export default function DiscountExplainer() {
  return (
    <div className="card-base bg-gradient-to-br from-brand-warm/80 to-amber-50/60 border-amber-100">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-brand-orange/10 flex items-center justify-center">
          <Info className="w-4 h-4 text-brand-orange" />
        </div>
        <h3 className="font-heading text-sm font-semibold text-brand-slate">How Discounts Work</h3>
      </div>

      <p className="text-sm text-brand-olive mb-4">
        Discount suggestions are based on how soon an item expires. The closer to expiry, the higher the recommended discount.
      </p>

      <div className="space-y-2">
        {DISCOUNT_RULES.map((rule, idx) => (
          <div key={idx} className="flex items-center justify-between p-2.5 bg-white/70 rounded-xl">
            <span className="text-sm text-brand-slate font-medium">{rule.days}</span>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${rule.color}`}>
              {rule.discount} off
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs text-brand-olive/70 mt-3">
        Discounting near-expiry items helps recover costs and reduce waste.
      </p>
    </div>
  );
}
