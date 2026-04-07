import { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { getFlashSaleSuggestions } from '../lib/api';
import FlashSaleCard from '../components/flash-sale/FlashSaleCard';
import DiscountExplainer from '../components/flash-sale/DiscountExplainer';
import EmptyState from '../components/shared/EmptyState';
import LoadingSpinner from '../components/shared/LoadingSpinner';

export default function FlashSalesPage() {
  const { items, addToast } = useInventory();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggestions();
  }, [items]);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const results = await getFlashSaleSuggestions();
      setSuggestions(results);
    } catch {
      addToast('Failed to load flash sale suggestions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (suggestion) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    addToast(`${suggestion.name} marked as reviewed`, 'success');
  };

  const handleCreateSale = (suggestion) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    addToast(`Flash sale created for ${suggestion.name} at ${suggestion.suggestedDiscount}% off!`, 'success');
  };

  const handleDismiss = (suggestion) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    addToast(`${suggestion.name} dismissed`, 'info');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-brand-green-dark flex items-center gap-2">
          <Zap className="w-7 h-7 text-brand-orange" />
          Flash Sale Suggestions
        </h1>
        <p className="text-sm text-brand-olive mt-1">
          Smart discount recommendations to help you sell items before they expire
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Calculating best discounts..." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Suggestions */}
          <div className="lg:col-span-2">
            {suggestions.length === 0 ? (
              <EmptyState
                icon={Zap}
                title="No flash sale suggestions"
                description="All items are safely away from their expiry dates. Check back later!"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestions.map(suggestion => (
                  <FlashSaleCard
                    key={suggestion.id}
                    suggestion={suggestion}
                    onReview={handleReview}
                    onCreateSale={handleCreateSale}
                    onDismiss={handleDismiss}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Explainer */}
          <div>
            <DiscountExplainer />

            {/* Summary card */}
            {suggestions.length > 0 && (
              <div className="card-base mt-4">
                <h4 className="font-heading text-sm font-semibold text-brand-slate mb-3">Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-brand-olive">Items needing discounts</span>
                    <span className="font-semibold text-brand-slate">{suggestions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-olive">Critical urgency</span>
                    <span className="font-semibold text-red-600">
                      {suggestions.filter(s => s.urgency === 'critical').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-olive">High urgency</span>
                    <span className="font-semibold text-amber-600">
                      {suggestions.filter(s => s.urgency === 'high').length}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
