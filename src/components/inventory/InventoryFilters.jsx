import { Search, SlidersHorizontal } from 'lucide-react';
import { CATEGORIES } from '../../lib/constants';
import { cn } from '../../lib/utils';

const FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'safe', label: 'Safe' },
  { id: 'near_expiry', label: 'Near Expiry' },
  { id: 'expired', label: 'Expired' },
  { id: 'low_stock', label: 'Low Stock' },
];

const SORT_OPTIONS = [
  { id: 'expiry_asc', label: 'Expiry (soonest)' },
  { id: 'expiry_desc', label: 'Expiry (latest)' },
  { id: 'qty_asc', label: 'Quantity (low → high)' },
  { id: 'qty_desc', label: 'Quantity (high → low)' },
  { id: 'name_asc', label: 'Name (A → Z)' },
  { id: 'added_desc', label: 'Recently added' },
];

export default function InventoryFilters({
  search, onSearchChange,
  filter, onFilterChange,
  sort, onSortChange,
  category, onCategoryChange,
  counts,
}) {
  return (
    <div className="space-y-3">
      {/* Search + Sort row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search items..."
            className="input-base pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="input-base text-sm w-auto min-w-[160px]"
          >
            {SORT_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="input-base text-sm w-auto min-w-[130px]"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {FILTER_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onFilterChange(tab.id)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-150 min-h-[40px]',
              filter === tab.id
                ? 'bg-brand-green text-white shadow-md'
                : 'bg-white text-brand-olive border border-gray-200 hover:border-brand-green/30 hover:text-brand-green'
            )}
          >
            {tab.label}
            {counts && counts[tab.id] !== undefined && (
              <span className={cn(
                'ml-1.5 px-1.5 py-0.5 rounded-full text-xs',
                filter === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-brand-olive'
              )}>
                {counts[tab.id]}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
