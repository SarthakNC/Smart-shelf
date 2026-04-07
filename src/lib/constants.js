import {
  LayoutDashboard,
  Package,
  FileText,
  Zap,
  Settings,
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { id: 'inventory', label: 'Inventory', path: '/inventory', icon: Package },
  { id: 'invoice-parser', label: 'Invoice Parser', path: '/invoice-parser', icon: FileText },
  { id: 'flash-sales', label: 'Flash Sales', path: '/flash-sales', icon: Zap },
  { id: 'settings', label: 'Settings', path: '/settings', icon: Settings },
];

export const CATEGORIES = [
  'Dairy',
  'Bakery',
  'Snacks',
  'Beverages',
  'Grains & Flour',
  'Oil & Ghee',
  'Spices',
  'Personal Care',
  'Packaged Food',
  'Frozen',
  'Fruits & Vegetables',
  'Other',
];

export const UNITS = ['pcs', 'kg', 'g', 'L', 'ml', 'pkt', 'dozen', 'box'];

export const STATUS = {
  SAFE: 'safe',
  NEAR_EXPIRY: 'near_expiry',
  EXPIRED: 'expired',
  LOW_STOCK: 'low_stock',
};

export const URGENCY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

export const NEAR_EXPIRY_THRESHOLD_DAYS = 7;
export const LOW_STOCK_THRESHOLD = 5;

export const SHOP_NAME = 'Sarthak General Store';
export const CURRENCY = '₹';
