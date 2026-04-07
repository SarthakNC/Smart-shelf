import { useState } from 'react';
import { Settings, Save, Store, Bell, Clock, Package } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { SHOP_NAME } from '../lib/constants';

export default function SettingsPage() {
  const { addToast } = useInventory();
  const [settings, setSettings] = useState({
    shopName: SHOP_NAME,
    ownerName: 'Sarthak Chumblkar',
    phone: '+91 7020919440',
    nearExpiryDays: 7,
    lowStockThreshold: 5,
    currency: 'INR',
    notifyExpiry: true,
    notifyLowStock: true,
    notifyFlashSale: false,
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    addToast('Settings saved successfully!', 'success');
    setSaving(false);
  };

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-brand-green-dark flex items-center gap-2">
          <Settings className="w-7 h-7 text-brand-olive" />
          Settings
        </h1>
        <p className="text-sm text-brand-olive mt-1">Manage your store preferences</p>
      </div>

      {/* Shop Info */}
      <div className="card-base">
        <div className="flex items-center gap-2 mb-4">
          <Store className="w-5 h-5 text-brand-green" />
          <h3 className="section-title">Shop Information</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-brand-olive mb-1.5 block">Shop Name</label>
            <input name="shopName" value={settings.shopName} onChange={handleChange} className="input-base" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-brand-olive mb-1.5 block">Owner Name</label>
              <input name="ownerName" value={settings.ownerName} onChange={handleChange} className="input-base" />
            </div>
            <div>
              <label className="text-sm font-medium text-brand-olive mb-1.5 block">Contact Number</label>
              <input name="phone" value={settings.phone} onChange={handleChange} className="input-base" />
            </div>
          </div>
        </div>
      </div>

      {/* Thresholds */}
      <div className="card-base">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-brand-orange" />
          <h3 className="section-title">Alert Thresholds</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-brand-olive mb-1.5 block">
              Near-expiry alert (days before expiry)
            </label>
            <input
              name="nearExpiryDays"
              type="number"
              min="1"
              max="30"
              value={settings.nearExpiryDays}
              onChange={handleChange}
              className="input-base"
            />
            <p className="text-xs text-brand-olive mt-1">Items expiring within this many days will be flagged</p>
          </div>
          <div>
            <label className="text-sm font-medium text-brand-olive mb-1.5 block">
              Low stock threshold (units)
            </label>
            <input
              name="lowStockThreshold"
              type="number"
              min="1"
              max="50"
              value={settings.lowStockThreshold}
              onChange={handleChange}
              className="input-base"
            />
            <p className="text-xs text-brand-olive mt-1">Items with fewer units than this will show as low stock</p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card-base">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-purple-600" />
          <h3 className="section-title">Notifications</h3>
        </div>
        <div className="space-y-4">
          {[
            { name: 'notifyExpiry', label: 'Expiry Alerts', desc: 'Get notified when items are near expiry or expired' },
            { name: 'notifyLowStock', label: 'Low Stock Alerts', desc: 'Get notified when items are running low' },
            { name: 'notifyFlashSale', label: 'Flash Sale Reminders', desc: 'Get daily reminders about items that could be discounted' },
          ].map(toggle => (
            <div key={toggle.name} className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 border border-gray-100">
              <div>
                <p className="text-sm font-medium text-brand-slate">{toggle.label}</p>
                <p className="text-xs text-brand-olive mt-0.5">{toggle.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name={toggle.name}
                  checked={settings[toggle.name]}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-brand-green/30 rounded-full peer
                  peer-checked:after:translate-x-full peer-checked:after:border-white
                  after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                  after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
                  after:transition-all peer-checked:bg-brand-green"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="btn-primary flex items-center gap-2"
      >
        {saving ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        {saving ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  );
}
