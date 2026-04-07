import { useState, useMemo } from 'react';
import { Plus, Package } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import InventoryFilters from '../components/inventory/InventoryFilters';
import InventoryTable from '../components/inventory/InventoryTable';
import AddItemModal from '../components/inventory/AddItemModal';
import EditItemModal from '../components/inventory/EditItemModal';
import ConfirmDialog from '../components/shared/ConfirmDialog';
import EmptyState from '../components/shared/EmptyState';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { STATUS } from '../lib/constants';

export default function InventoryPage() {
  const { items, loading, deleteItem, markSold } = useInventory();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('expiry_asc');
  const [category, setCategory] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [soldTarget, setSoldTarget] = useState(null);
  const [soldQty, setSoldQty] = useState(1);

  // Filter + Sort
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(i => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));
    }

    // Category
    if (category !== 'all') {
      result = result.filter(i => i.category === category);
    }

    // Status filter
    if (filter !== 'all') {
      if (filter === 'low_stock') {
        result = result.filter(i => i.quantity <= 5 && i.status !== STATUS.EXPIRED);
      } else {
        result = result.filter(i => i.status === filter);
      }
    }

    // Sort
    switch (sort) {
      case 'expiry_asc': result.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate)); break;
      case 'expiry_desc': result.sort((a, b) => new Date(b.expiryDate) - new Date(a.expiryDate)); break;
      case 'qty_asc': result.sort((a, b) => a.quantity - b.quantity); break;
      case 'qty_desc': result.sort((a, b) => b.quantity - a.quantity); break;
      case 'name_asc': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'added_desc': result.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate)); break;
      default: break;
    }

    return result;
  }, [items, search, filter, sort, category]);

  // Counts for filter badges
  const counts = useMemo(() => ({
    all: items.length,
    safe: items.filter(i => i.status === STATUS.SAFE).length,
    near_expiry: items.filter(i => i.status === STATUS.NEAR_EXPIRY).length,
    expired: items.filter(i => i.status === STATUS.EXPIRED).length,
    low_stock: items.filter(i => i.quantity <= 5 && i.status !== STATUS.EXPIRED).length,
  }), [items]);

  if (loading) return <LoadingSpinner fullPage message="Loading inventory..." />;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-brand-green-dark">Inventory</h1>
          <p className="text-sm text-brand-olive mt-1">{items.length} items in stock</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary text-sm flex items-center gap-2 w-fit">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {/* Filters */}
      <InventoryFilters
        search={search} onSearchChange={setSearch}
        filter={filter} onFilterChange={setFilter}
        sort={sort} onSortChange={setSort}
        category={category} onCategoryChange={setCategory}
        counts={counts}
      />

      {/* Table / Cards */}
      <div className="card-base !p-0 md:!p-0 overflow-hidden">
        {filteredItems.length === 0 ? (
          <EmptyState
            icon={Package}
            title={search || filter !== 'all' ? 'No matching items' : 'No items in inventory'}
            description={search || filter !== 'all' ? 'Try adjusting your search or filters.' : 'Add your first item to start tracking.'}
            action={!search && filter === 'all' ? () => setShowAdd(true) : undefined}
            actionLabel="Add Item"
          />
        ) : (
          <div className="p-3 md:p-0">
            <InventoryTable
              items={filteredItems}
              onEdit={(item) => setEditItem(item)}
              onDelete={(item) => setDeleteTarget(item)}
              onMarkSold={(item) => { setSoldTarget(item); setSoldQty(1); }}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <AddItemModal isOpen={showAdd} onClose={() => setShowAdd(false)} />
      <EditItemModal isOpen={!!editItem} onClose={() => setEditItem(null)} item={editItem} />

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteItem(deleteTarget.id, deleteTarget.name)}
        title={`Delete ${deleteTarget?.name}?`}
        description="This will permanently remove the item from your inventory. This action cannot be undone."
        confirmLabel="Delete Item"
      />

      {/* Mark Sold Dialog */}
      {soldTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSoldTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-slide-up z-10">
            <h3 className="font-heading text-lg font-semibold text-brand-slate mb-2">Mark as Sold</h3>
            <p className="text-sm text-brand-olive mb-4">
              How many <strong>{soldTarget.name}</strong> did you sell?
              <br />
              <span className="text-xs">(Current stock: {soldTarget.quantity} {soldTarget.unit})</span>
            </p>
            <input
              type="number"
              min="1"
              max={soldTarget.quantity}
              value={soldQty}
              onChange={(e) => setSoldQty(Math.min(parseInt(e.target.value) || 1, soldTarget.quantity))}
              className="input-base mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => setSoldTarget(null)} className="btn-ghost flex-1 text-sm">Cancel</button>
              <button
                onClick={() => { markSold(soldTarget.id, soldQty); setSoldTarget(null); }}
                className="btn-primary flex-1 text-sm"
              >
                Confirm Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
