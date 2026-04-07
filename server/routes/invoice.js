import { Router } from 'express';

const router = Router();

// POST /api/invoice/parse — Parse raw invoice text
router.post('/parse', async (req, res) => {
  try {
    const { rawText } = req.body;
    if (!rawText || !rawText.trim()) {
      return res.status(400).json({ error: 'rawText is required' });
    }

    const lines = rawText.split('\n').filter(line => line.trim());
    const parsed = [];

    for (const line of lines) {
      const match = line.match(
        /^(.+?)\s*(?:x\s*)?(\d+)\s*(pkt|pcs|kg|g|L|ml|dozen|box)?\s*(?:@\s*)?(\d+)?/i
      );
      if (match) {
        const name = match[1].replace(/[-–—]+$/, '').trim();
        const qty = parseInt(match[2], 10);

        if (
          name.length > 2 &&
          !name.match(/^(Invoice|Date|Total|Payment|GST|Tax|---)/i) &&
          qty > 0
        ) {
          const confidence =
            name.length > 5
              ? 0.85 + Math.random() * 0.14
              : 0.6 + Math.random() * 0.25;

          parsed.push({
            id: Date.now().toString(36) + Math.random().toString(36).substring(2, 9),
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

    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: 'Failed to parse invoice', details: err.message });
  }
});

export default router;
