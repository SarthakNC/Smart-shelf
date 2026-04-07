import { Sparkles, Info, FileText, ArrowRight } from 'lucide-react';
import { SAMPLE_INVOICE_TEXT } from '../../lib/mock-data';

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
