import { Router } from 'express';
import Item from '../models/Item.js';
import {
  enrichItem,
  getDaysUntilExpiry,
  getDiscountForDaysLeft,
  getUrgencyLevel,
  NEAR_EXPIRY_THRESHOLD_DAYS,
} from '../lib/helpers.js';

const router = Router();

// GET /api/flash-sales/suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const items = await Item.find();
    const enriched = items.map(enrichItem);

    const nearExpiry = enriched.filter(item => {
      return item.daysLeft >= 0 && item.daysLeft <= NEAR_EXPIRY_THRESHOLD_DAYS;
    });

    const suggestions = nearExpiry.map(item => {
      const discount = getDiscountForDaysLeft(item.daysLeft);
      const urgency = getUrgencyLevel(item.daysLeft);

      let reason = '';
      if (item.daysLeft <= 1) reason = 'Expires tomorrow or today — sell immediately';
      else if (item.daysLeft <= 3) reason = 'Only a few days left — aggressive discount recommended';
      else if (item.daysLeft <= 5) reason = 'Approaching expiry — moderate discount may help';
      else reason = 'Within expiry alert window — a small discount can boost sales';

      return {
        ...item,
        suggestedDiscount: discount,
        urgency,
        reason,
        discountedPrice: Math.round(item.sellingPrice * (1 - discount / 100)),
        potentialLoss: item.costPrice * item.quantity,
      };
    });

    suggestions.sort((a, b) => a.daysLeft - b.daysLeft);
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get suggestions', details: err.message });
  }
});

export default router;
