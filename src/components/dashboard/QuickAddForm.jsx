import { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { CATEGORIES, UNITS } from '../../lib/constants';

export default function QuickAddForm() {
  const { addItem } = useInventory();
  const [form, setForm] = useState({
    name: '',
    quantity: '',
    unit: 'pcs',
    category: 'Other',
    expiryDate: '',
    costPrice: '',
    sellingPrice: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.quantity || !form.expiryDate) return;
    setSubmitting(true);
    await addItem({
      name: form.name,
      quantity: parseInt(form.quantity, 10),
      unit: form.unit,
      category: form.category,
      expiryDate: form.expiryDate,
      costPrice: form.costPrice ? parseFloat(form.costPrice) : 0,
      sellingPrice: form.sellingPrice ? parseFloat(form.sellingPrice) : 0,
    });
    setForm({ name: '', quantity: '', unit: 'pcs', category: 'Other', expiryDate: '', costPrice: '', sellingPrice: '' });
    setSubmitting(false);
  };

  return (
    <div className="card-base">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-brand-green/10 flex items-center justify-center">
          <Plus className="w-4 h-4 text-brand-green" />
        </div>
        <h3 className="section-title">Quick Add Item</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label htmlFor="qa-name" className="text-xs font-medium text-brand-olive mb-1 block">Item Name *</label>
            <input
              id="qa-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Amul Milk 500ml"
              className="input-base"
              required
            />
          </div>

          <div>
            <label htmlFor="qa-qty" className="text-xs font-medium text-brand-olive mb-1 block">Quantity *</label>
            <div className="flex gap-2">
              <input
                id="qa-qty"
                name="quantity"
                type="number"
                min="1"
                value={form.quantity}
                onChange={handleChange}
                placeholder="10"
                className="input-base flex-1"
                required
              />
              <select
                name="unit"
                value={form.unit}
                onChange={handleChange}
                className="input-base w-20"
              >
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="qa-expiry" className="text-xs font-medium text-brand-olive mb-1 block">Expiry Date *</label>
            <div className="relative">
              <input
                id="qa-expiry"
                name="expiryDate"
                type="date"
                value={form.expiryDate}
                onChange={handleChange}
                className="input-base"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="qa-category" className="text-xs font-medium text-brand-olive mb-1 block">Category</label>
            <select
              id="qa-category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="input-base"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="qa-cost" className="text-xs font-medium text-brand-olive mb-1 block">Cost Price (₹)</label>
            <input
              id="qa-cost"
              name="costPrice"
              type="number"
              min="0"
              step="0.5"
              value={form.costPrice}
              onChange={handleChange}
              placeholder="0"
              className="input-base"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || !form.name || !form.quantity || !form.expiryDate}
          className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
        >
          {submitting ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          {submitting ? 'Adding...' : 'Add to Inventory'}
        </button>
      </form>
    </div>
  );
}
