import { NavLink } from 'react-router-dom';
import { NAV_ITEMS, SHOP_NAME } from '../../lib/constants';
import { Store, ChevronLeft } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Sidebar({ collapsed, onToggleCollapse }) {
  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col bg-sidebar-dark text-white h-screen sticky top-0 transition-all duration-300 shadow-sidebar',
        collapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 px-5 h-16 border-b border-white/10',
        collapsed && 'justify-center px-0'
      )}>
        <div className="w-9 h-9 rounded-xl bg-brand-orange flex items-center justify-center flex-shrink-0">
          <Store className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-heading text-base font-bold text-white truncate">Smart Shelf</h1>
            <p className="text-[11px] text-emerald-300/70 truncate">{SHOP_NAME}</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
              collapsed && 'justify-center px-0',
              isActive
                ? 'bg-sidebar-active text-white shadow-md'
                : 'text-emerald-100/70 hover:bg-sidebar-hover hover:text-white'
            )}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggleCollapse}
        className="flex items-center justify-center h-12 border-t border-white/10 text-emerald-100/50 hover:text-white hover:bg-sidebar-hover transition-all"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <ChevronLeft className={cn('w-5 h-5 transition-transform', collapsed && 'rotate-180')} />
      </button>
    </aside>
  );
}
