import { Menu, Search, Bell, User } from 'lucide-react';
import { SHOP_NAME } from '../../lib/constants';
import { useInventory } from '../../context/InventoryContext';

export default function TopBar({ onMenuToggle }) {
  const { alerts } = useInventory();
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-topbar">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 -ml-1 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-brand-slate" />
          </button>
          <div className="hidden sm:block">
            <h2 className="font-heading text-base font-semibold text-brand-slate">{SHOP_NAME}</h2>
            <p className="text-xs text-brand-olive">{today}</p>
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search inventory..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm
                         placeholder:text-gray-400 focus:bg-white focus:border-brand-green
                         focus:ring-2 focus:ring-brand-green/20 transition-all"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Mobile search */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Search">
            <Search className="w-5 h-5 text-brand-olive" />
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Notifications">
            <Bell className="w-5 h-5 text-brand-olive" />
            {alerts.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-brand-red text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-badge-pop">
                {alerts.length > 9 ? '9+' : alerts.length}
              </span>
            )}
          </button>

          {/* Profile */}
          <button className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-green to-brand-green-light flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="hidden sm:block text-sm font-medium text-brand-slate">Sharma Ji</span>
          </button>
        </div>
      </div>
    </header>
  );
}
