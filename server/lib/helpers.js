// Constants
export const STATUS = {
  SAFE: 'safe',
  NEAR_EXPIRY: 'near_expiry',
  EXPIRED: 'expired',
  LOW_STOCK: 'low_stock',
};

export const NEAR_EXPIRY_THRESHOLD_DAYS = 7;
export const LOW_STOCK_THRESHOLD = 5;

// Business logic helpers
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

export function enrichItem(item) {
  const obj = item.toObject ? item.toObject() : { ...item };
  obj.daysLeft = getDaysUntilExpiry(obj.expiryDate);
  obj.status = getItemStatus(obj);
  return obj;
}
