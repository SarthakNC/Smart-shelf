import { NEAR_EXPIRY_THRESHOLD_DAYS, LOW_STOCK_THRESHOLD, STATUS, CURRENCY } from './constants';

export function getDaysUntilExpiry(expiryDate) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  const diff = expiry.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getItemStatus(item) {
  const daysLeft = getDaysUntilExpiry(item.expiryDate);
  if (daysLeft <= 0) return STATUS.EXPIRED;
  if (daysLeft <= NEAR_EXPIRY_THRESHOLD_DAYS) return STATUS.NEAR_EXPIRY;
  if (item.quantity <= LOW_STOCK_THRESHOLD) return STATUS.LOW_STOCK;
  return STATUS.SAFE;
}

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateShort(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function formatCurrency(amount) {
  return `${CURRENCY}${Number(amount).toLocaleString('en-IN')}`;
}

export function getDaysLeftLabel(daysLeft) {
  if (daysLeft <= 0) return 'Expired';
  if (daysLeft === 1) return '1 day left';
  return `${daysLeft} days left`;
}

export function getStatusColor(status) {
  switch (status) {
    case STATUS.SAFE: return 'text-emerald-600';
    case STATUS.NEAR_EXPIRY: return 'text-amber-600';
    case STATUS.EXPIRED: return 'text-red-600';
    case STATUS.LOW_STOCK: return 'text-blue-600';
    default: return 'text-gray-600';
  }
}

export function getStatusBg(status) {
  switch (status) {
    case STATUS.SAFE: return 'bg-emerald-50 border-emerald-200';
    case STATUS.NEAR_EXPIRY: return 'bg-amber-50 border-amber-200';
    case STATUS.EXPIRED: return 'bg-red-50 border-red-200';
    case STATUS.LOW_STOCK: return 'bg-blue-50 border-blue-200';
    default: return 'bg-gray-50 border-gray-200';
  }
}

export function getDiscountForDaysLeft(daysLeft) {
  if (daysLeft <= 1) return 40;
  if (daysLeft <= 3) return 25;
  if (daysLeft <= 5) return 15;
  if (daysLeft <= 7) return 10;
  return 0;
}

export function getUrgencyLevel(daysLeft) {
  if (daysLeft <= 1) return 'critical';
  if (daysLeft <= 3) return 'high';
  if (daysLeft <= 5) return 'medium';
  return 'low';
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getStockRiskData(items) {
  const today = new Date();
  const data = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dateStr = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    const expiringCount = items.filter(item => {
      const days = getDaysUntilExpiry(item.expiryDate);
      return days >= 0 && days <= i;
    }).length;
    const riskValue = items
      .filter(item => {
        const days = getDaysUntilExpiry(item.expiryDate);
        return days >= 0 && days <= i;
      })
      .reduce((sum, item) => sum + (item.costPrice || 0) * item.quantity, 0);
    data.push({ date: dateStr, items: expiringCount, risk: riskValue });
  }
  return data;
}
