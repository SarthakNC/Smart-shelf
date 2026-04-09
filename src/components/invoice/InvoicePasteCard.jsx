import { Sparkles, FileText, ArrowRight, UploadCloud, X } from 'lucide-react';

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

export default function InvoicePasteCard({ value, onChange, file, onFileChange, onParse, parsing }) {
  const hasContent = value.trim().length > 0 || file !== null;

  return (
    <div className="card-base">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
          <FileText className="w-4 h-4 text-purple-600" />
        </div>
        <h3 className="section-title">Upload or Paste Supplier Invoice</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Text Area */}
        <div>
          <label className="text-xs font-semibold text-brand-slate uppercase mb-2 block">Option 1: Paste Text</label>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={SAMPLE_INVOICE_TEXT}
            disabled={file !== null} // disable text if file is uploaded
            className="input-base font-mono text-sm resize-y min-h-[200px] disabled:opacity-50"
            aria-label="Raw invoice text"
          />
        </div>

        {/* File Upload */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-brand-slate uppercase mb-2 block">Option 2: Upload PDF/Image</label>
          <div className="flex-1 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center p-6 text-center transition-colors hover:bg-gray-100 relative group overflow-hidden">
            {file ? (
              <div className="z-10 flex flex-col items-center">
                <FileText className="w-8 h-8 text-brand-green mb-2" />
                <p className="text-sm font-medium text-brand-slate max-w-[200px] truncate">{file.name}</p>
                <p className="text-xs text-brand-olive mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                <button 
                  onClick={() => onFileChange(null)}
                  className="mt-4 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-red-600 shadow-sm hover:bg-red-50 flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Remove File
                </button>
              </div>
            ) : (
              <div className="z-10 flex flex-col items-center pointer-events-none opacity-50">
                <UploadCloud className="w-8 h-8 text-brand-olive mb-2 group-hover:text-brand-green transition-colors" />
                <p className="text-sm font-medium text-brand-slate">Drag & Drop or Click to Upload</p>
                <p className="text-xs text-brand-olive mt-1">Supports .pdf, .jpg, .png</p>
              </div>
            )}
            
            {/* Invisible actual file input overlapping the zone */}
            {!file && (
              <input 
                type="file" 
                accept=".pdf,image/jpeg,image/png"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    onFileChange(e.target.files[0]);
                  }
                }}
                disabled={value.trim().length > 0} // disable file if text is entered
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
              />
            )}
            
            {value.trim().length > 0 && !file && (
              <div className="absolute inset-0 bg-white/60 z-20 flex items-center justify-center p-4 text-center">
                <p className="text-xs font-medium text-brand-slate bg-white px-3 py-1.5 rounded-full shadow-sm">
                  Clear text area to enable file upload
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={onParse}
          disabled={parsing || !hasContent}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          {parsing ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing Document...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              {file ? 'Extract from File' : 'Parse Invoice Text'}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
