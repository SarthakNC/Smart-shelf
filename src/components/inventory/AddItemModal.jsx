import { useState } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { CATEGORIES, UNITS } from '../../lib/constants';

export default function AddItemModal({ isOpen, onClose }) {
  const { addItem } = useInventory();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '', quantity: '', unit: 'pcs', category: 'Other',
    expiryDate: '', costPrice: '', sellingPrice: '',
  });

  if (!isOpen) return null;

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

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
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 animate-slide-up z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading text-lg font-semibold text-brand-slate">Add New Item</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Close">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-brand-olive mb-1.5 block">Item Name *</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Amul Paneer 200g" className="input-base" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-brand-olive mb-1.5 block">Quantity *</label>
              <input name="quantity" type="number" min="1" value={form.quantity} onChange={handleChange} placeholder="10" className="input-base" required />
            </div>
            <div>
              <label className="text-sm font-medium text-brand-olive mb-1.5 block">Unit</label>
              <select name="unit" value={form.unit} onChange={handleChange} className="input-base">
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-brand-olive mb-1.5 block">Expiry Date *</label>
              <input name="expiryDate" type="date" value={form.expiryDate} onChange={handleChange} className="input-base" required />
            </div>
            <div>
              <label className="text-sm font-medium text-brand-olive mb-1.5 block">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="input-base">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-brand-olive mb-1.5 block">Cost Price (₹)</label>
              <input name="costPrice" type="number" min="0" step="0.5" value={form.costPrice} onChange={handleChange} placeholder="0" className="input-base" />
            </div>
            <div>
              <label className="text-sm font-medium text-brand-olive mb-1.5 block">Selling Price (₹)</label>
              <input name="sellingPrice" type="number" min="0" step="0.5" value={form.sellingPrice} onChange={handleChange} placeholder="0" className="input-base" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1 text-sm">Cancel</button>
            <button type="submit" disabled={submitting || !form.name || !form.quantity || !form.expiryDate} className="btn-primary flex-1 text-sm flex items-center justify-center gap-2">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {submitting ? 'Adding...' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
