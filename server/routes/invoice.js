import { Router } from 'express';
import { GoogleGenAI, Type } from '@google/genai';

const router = Router();

// POST /api/invoice/parse — Parse raw invoice text
router.post('/parse', async (req, res) => {
  try {
    const { rawText } = req.body;
    if (!rawText || !rawText.trim()) {
      return res.status(400).json({ error: 'rawText is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is missing in server/.env' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Define JSON schema for the AI to return
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        items: {
          type: Type.ARRAY,
          description: "List of items extracted from the invoice",
          items: {
            type: Type.OBJECT,
            properties: {
              itemName: { type: Type.STRING, description: "Name of the product" },
              quantity: { type: Type.NUMBER, description: "Quantity of the product" },
              unit: { type: Type.STRING, description: "Unit of measurement (e.g., pcs, kg, pkt). Default to 'pcs' if unknown." },
              costPrice: { type: Type.NUMBER, description: "Cost or price per unit, if mentioned. Provide 0 if unknown." },
              expiryDate: { type: Type.STRING, description: "The expiration date if mentioned, formatted as YYYY-MM-DD. Leave empty if not found." },
              confidence: { type: Type.NUMBER, description: "Your confidence score from 0.0 to 1.0 that this item was accurately extracted." }
            },
            required: ["itemName", "quantity", "unit", "confidence"]
          }
        }
      },
      required: ["items"]
    };

    const prompt = `
    You are an expert data extraction assistant.
    Extract the list of items from this messy supplier invoice text.
    Ignore lines that are purely headers, footers, taxes, dates, or total amounts.
    Return strictly JSON matching the provided schema.

    Here is the messy invoice text:
    """
    ${rawText}
    """
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.1, // low temp for extraction
      }
    });

    const aiData = JSON.parse(response.text);
    const parsedItems = aiData.items || [];

    // Map the AI response to match the frontend shape
    const formatted = parsedItems.map(item => ({
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 9),
      rawText: `${item.itemName} x ${item.quantity} ${item.unit}`, // fallback raw text
      itemName: item.itemName,
      quantity: item.quantity,
      unit: item.unit && item.unit !== "" ? item.unit : 'pcs',
      costPrice: item.costPrice || null,
      expiryDate: item.expiryDate || null,
      confidence: item.confidence,
      isSelected: true,
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Invoice Parse Error:', err);
    res.status(500).json({ error: 'Failed to parse invoice', details: err.message });
  }
});

export default router;
