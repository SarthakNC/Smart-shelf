import { Router } from 'express';
import Item from '../models/Item.js';
import { enrichItem } from '../lib/helpers.js';

const router = Router();

// GET /api/items — Fetch all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    const enriched = items.map(enrichItem);
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch items', details: err.message });
  }
});

// POST /api/items — Create one item
router.post('/', async (req, res) => {
  try {
    const item = await Item.create(req.body);
    res.status(201).json(enrichItem(item));
  } catch (err) {
    res.status(400).json({ error: 'Failed to create item', details: err.message });
  }
});

// POST /api/items/bulk — Create multiple items
router.post('/bulk', async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items array is required' });
    }
    const created = await Item.insertMany(items);
    const enriched = created.map(enrichItem);
    res.status(201).json(enriched);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create items', details: err.message });
  }
});

// PUT /api/items/:id — Update an item
router.put('/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(enrichItem(item));
  } catch (err) {
    res.status(400).json({ error: 'Failed to update item', details: err.message });
  }
});

// DELETE /api/items/:id — Delete an item
router.delete('/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item', details: err.message });
  }
});

export default router;
