import { delay, generateId, getDaysUntilExpiry, getItemStatus, getDiscountForDaysLeft, getUrgencyLevel } from './utils';
import { STATUS, NEAR_EXPIRY_THRESHOLD_DAYS } from './constants';

// Simulate network delays
const API_DELAY = 400;

export async function fetchInventory(items) {
  await delay(API_DELAY);
  return items.map(item => ({
    ...item,
    status: getItemStatus(item),
    daysLeft: getDaysUntilExpiry(item.expiryDate),
  }));
}

export async function addItem(newItem) {
  await delay(API_DELAY);
  return {
    id: generateId(),
    ...newItem,
    addedDate: new Date().toISOString().split('T')[0],
    status: getItemStatus(newItem),
    daysLeft: getDaysUntilExpiry(newItem.expiryDate),
  };
}

export async function updateItem(updatedItem) {
  await delay(API_DELAY);
  return {
    ...updatedItem,
    status: getItemStatus(updatedItem),
    daysLeft: getDaysUntilExpiry(updatedItem.expiryDate),
  };
}

export async function deleteItem(itemId) {
  await delay(300);
  return { success: true, id: itemId };
}

export async function parseInvoice(rawText) {
  await delay(1200); // simulate AI processing
  const lines = rawText.split('\n').filter(line => line.trim());
  const parsed = [];

  for (const line of lines) {
    // Match patterns like: "Item Name x 10 pkt @ 50" or "Item Name  10 pcs  50"
    const match = line.match(/^(.+?)\s*(?:x\s*)?(\d+)\s*(pkt|pcs|kg|g|L|ml|dozen|box)?\s*(?:@\s*)?(\d+)?/i);
    if (match) {
      const name = match[1].replace(/[-–—]+$/, '').trim();
      const qty = parseInt(match[2], 10);
      // Filter out header/footer lines
      if (name.length > 2 && !name.match(/^(Invoice|Date|Total|Payment|GST|Tax|---)/i) && qty > 0) {
        const confidence = name.length > 5 ? (0.85 + Math.random() * 0.14) : (0.6 + Math.random() * 0.25);
        parsed.push({
          id: generateId(),
          rawText: line.trim(),
          itemName: name,
          quantity: qty,
          unit: match[3] || 'pcs',
          costPrice: match[4] ? parseInt(match[4], 10) : null,
          confidence: Math.round(confidence * 100) / 100,
          isSelected: true,
        });
      }
    }
  }

  return parsed;
}

export async function getFlashSaleSuggestions(items) {
  await delay(API_DELAY);
  const nearExpiry = items.filter(item => {
    const days = getDaysUntilExpiry(item.expiryDate);
    return days >= 0 && days <= NEAR_EXPIRY_THRESHOLD_DAYS;
  });

  return nearExpiry.map(item => {
    const daysLeft = getDaysUntilExpiry(item.expiryDate);
    const discount = getDiscountForDaysLeft(daysLeft);
    const urgency = getUrgencyLevel(daysLeft);
    let reason = '';
    if (daysLeft <= 1) reason = 'Expires tomorrow or today — sell immediately';
    else if (daysLeft <= 3) reason = 'Only a few days left — aggressive discount recommended';
    else if (daysLeft <= 5) reason = 'Approaching expiry — moderate discount may help';
    else reason = 'Within expiry alert window — a small discount can boost sales';

    return {
      ...item,
      daysLeft,
      suggestedDiscount: discount,
      urgency,
      reason,
      discountedPrice: Math.round(item.sellingPrice * (1 - discount / 100)),
      potentialLoss: item.costPrice * item.quantity,
    };
  }).sort((a, b) => a.daysLeft - b.daysLeft);
}

export async function getKPIData(items) {
  await delay(200);
  const enriched = items.map(item => ({
    ...item,
    status: getItemStatus(item),
    daysLeft: getDaysUntilExpiry(item.expiryDate),
  }));

  const totalItems = enriched.length;
  const nearExpiry = enriched.filter(i => i.status === STATUS.NEAR_EXPIRY).length;
  const expired = enriched.filter(i => i.status === STATUS.EXPIRED).length;
  const lowStock = enriched.filter(i => i.quantity <= 5 && i.status !== STATUS.EXPIRED).length;
  const stockAtRisk = enriched
    .filter(i => i.status === STATUS.NEAR_EXPIRY || i.status === STATUS.EXPIRED)
    .reduce((sum, i) => sum + (i.costPrice || 0) * i.quantity, 0);

  return { totalItems, nearExpiry, expired, lowStock, stockAtRisk };
}

export async function getAlerts(items) {
  await delay(200);
  const alerts = [];
  items.forEach(item => {
    const daysLeft = getDaysUntilExpiry(item.expiryDate);
    if (daysLeft <= 0) {
      alerts.push({
        id: `alert-exp-${item.id}`,
        type: 'expired',
        item,
        message: `${item.name} has expired!`,
        priority: 1,
      });
    } else if (daysLeft <= NEAR_EXPIRY_THRESHOLD_DAYS) {
      alerts.push({
        id: `alert-ne-${item.id}`,
        type: 'near_expiry',
        item,
        message: `${item.name} expires in ${daysLeft} day${daysLeft > 1 ? 's' : ''}`,
        priority: daysLeft <= 2 ? 2 : 3,
      });
    }
  });
  return alerts.sort((a, b) => a.priority - b.priority);
}
