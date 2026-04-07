import { Sparkles, Info, FileText, ArrowRight } from 'lucide-react';

const SAMPLE_INVOICE_TEXT = `SHARMA WHOLESALE DISTRIBUTORS
Invoice #: INV-2024-0847
Date: 05/04/2026
---
Amul Taaza Milk 500ml  x 20 pkt  @ 22
Britannia Bread       x 10 pkt  @ 35
Mother Dairy Curd 400g x 15 pcs @ 30
Parle-G Biscuits 250g x 24 pkt  @ 20
Maggi Noodles 4-pack  x 12 pkt  @ 48
---
Total: Rs. 8,750
Payment: Due in 15 days`;

export default function InvoicePasteCard({ value, onChange, onParse, parsing }) {
  return (
    <div className="card-base">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
          <FileText className="w-4 h-4 text-purple-600" />
        </div>
        <h3 className="section-title">Paste Supplier Invoice</h3>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={SAMPLE_INVOICE_TEXT}
        rows={10}
        className="input-base font-mono text-sm resize-y min-h-[200px] mb-4"
        aria-label="Raw invoice text"
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onParse}
          disabled={parsing || !value.trim()}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          {parsing ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Parse Invoice
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
