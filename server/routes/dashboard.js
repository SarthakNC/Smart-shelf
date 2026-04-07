import { Router } from 'express';
import Item from '../models/Item.js';
import {
  enrichItem,
  getDaysUntilExpiry,
  STATUS,
  NEAR_EXPIRY_THRESHOLD_DAYS,
} from '../lib/helpers.js';

const router = Router();

// GET /api/dashboard/kpis — Dashboard KPI metrics
router.get('/kpis', async (req, res) => {
  try {
    const items = await Item.find();
    const enriched = items.map(enrichItem);

    const totalItems = enriched.length;
    const nearExpiry = enriched.filter(i => i.status === STATUS.NEAR_EXPIRY).length;
    const expired = enriched.filter(i => i.status === STATUS.EXPIRED).length;
    const lowStock = enriched.filter(i => i.quantity <= 5 && i.status !== STATUS.EXPIRED).length;
    const stockAtRisk = enriched
      .filter(i => i.status === STATUS.NEAR_EXPIRY || i.status === STATUS.EXPIRED)
      .reduce((sum, i) => sum + (i.costPrice || 0) * i.quantity, 0);

    res.json({ totalItems, nearExpiry, expired, lowStock, stockAtRisk });
  } catch (err) {
    res.status(500).json({ error: 'Failed to compute KPIs', details: err.message });
  }
});

// GET /api/dashboard/alerts — Expiry alerts
router.get('/alerts', async (req, res) => {
  try {
    const items = await Item.find();
    const alerts = [];

    items.forEach(item => {
      const daysLeft = getDaysUntilExpiry(item.expiryDate);
      const obj = enrichItem(item);

      if (daysLeft <= 0) {
        alerts.push({
          id: `alert-exp-${obj.id}`,
          type: 'expired',
          item: obj,
          message: `${item.name} has expired!`,
          priority: 1,
        });
      } else if (daysLeft <= NEAR_EXPIRY_THRESHOLD_DAYS) {
        alerts.push({
          id: `alert-ne-${obj.id}`,
          type: 'near_expiry',
          item: obj,
          message: `${item.name} expires in ${daysLeft} day${daysLeft > 1 ? 's' : ''}`,
          priority: daysLeft <= 2 ? 2 : 3,
        });
      }
    });

    alerts.sort((a, b) => a.priority - b.priority);
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch alerts', details: err.message });
  }
});

export default router;
