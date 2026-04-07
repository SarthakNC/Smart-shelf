import { useState } from 'react';
import { FileText, CheckCircle, RotateCcw, Plus } from 'lucide-react';
import InvoicePasteCard from '../components/invoice/InvoicePasteCard';
import ParsedInvoiceTable from '../components/invoice/ParsedInvoiceTable';
import ParserExplainer from '../components/invoice/ParserExplainer';
import EmptyState from '../components/shared/EmptyState';
import { useInventory } from '../context/InventoryContext';
import { parseInvoice } from '../lib/mock-api';

export default function InvoiceParserPage() {
  const { addBulkItems, addToast } = useInventory();
  const [rawText, setRawText] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parsedRows, setParsedRows] = useState([]);
  const [hasParsed, setHasParsed] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleParse = async () => {
    if (!rawText.trim()) return;
    setParsing(true);
    try {
      const results = await parseInvoice(rawText);
      setParsedRows(results);
      setHasParsed(true);
      if (results.length === 0) {
        addToast('No items could be extracted. Try different text.', 'warning');
      } else {
        addToast(`${results.length} items extracted successfully!`, 'success');
      }
    } catch {
      addToast('Failed to parse invoice. Please try again.', 'error');
    } finally {
      setParsing(false);
    }
  };

  const handleToggleRow = (id) => {
    setParsedRows(prev => prev.map(r => r.id === id ? { ...r, isSelected: !r.isSelected } : r));
  };

  const handleRemoveRow = (id) => {
    setParsedRows(prev => prev.filter(r => r.id !== id));
  };

  const handleUpdateRow = (id, field, value) => {
    setParsedRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleSelectAll = () => {
    const allSelected = parsedRows.every(r => r.isSelected);
    setParsedRows(prev => prev.map(r => ({ ...r, isSelected: !allSelected })));
  };

  const handleAddToInventory = async () => {
    const selected = parsedRows.filter(r => r.isSelected);
    if (selected.length === 0) {
      addToast('No items selected. Select items to import.', 'warning');
      return;
    }
    setImporting(true);

    // Create items from parsed rows — set expiry to 30 days from now for imported items
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const expiryStr = futureDate.toISOString().split('T')[0];

    const itemsToAdd = selected.map(r => ({
      name: r.itemName,
      quantity: r.quantity,
      unit: r.unit,
      category: 'Other',
      expiryDate: expiryStr,
      costPrice: r.costPrice || 0,
      sellingPrice: r.costPrice ? Math.round(r.costPrice * 1.15) : 0,
    }));

    await addBulkItems(itemsToAdd);
    setParsedRows([]);
    setRawText('');
    setHasParsed(false);
    setImporting(false);
  };

  const handleReset = () => {
    setParsedRows([]);
    setRawText('');
    setHasParsed(false);
  };

  const selectedCount = parsedRows.filter(r => r.isSelected).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-brand-green-dark">Invoice Parser</h1>
        <p className="text-sm text-brand-olive mt-1">Paste a supplier invoice and auto-extract items for your inventory</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main area */}
        <div className="lg:col-span-2 space-y-4">
          <InvoicePasteCard
            value={rawText}
            onChange={setRawText}
            onParse={handleParse}
            parsing={parsing}
          />

          {/* Parsed Results */}
          {hasParsed && parsedRows.length > 0 && (
            <div className="space-y-4 animate-slide-up">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="section-title flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  Extracted Items ({parsedRows.length})
                </h3>
                <div className="flex gap-2">
                  <button onClick={handleSelectAll} className="btn-ghost text-xs">
                    {parsedRows.every(r => r.isSelected) ? 'Deselect All' : 'Select All'}
                  </button>
                  <button onClick={handleReset} className="btn-ghost text-xs flex items-center gap-1">
                    <RotateCcw className="w-3.5 h-3.5" /> Reset
                  </button>
                </div>
              </div>

              <ParsedInvoiceTable
                rows={parsedRows}
                onToggleRow={handleToggleRow}
                onRemoveRow={handleRemoveRow}
                onUpdateRow={handleUpdateRow}
              />

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToInventory}
                  disabled={importing || selectedCount === 0}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {importing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Add {selectedCount} Item{selectedCount !== 1 ? 's' : ''} to Inventory
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {hasParsed && parsedRows.length === 0 && (
            <EmptyState
              icon={FileText}
              title="No items extracted"
              description="We couldn't find any items in the text. Try pasting a different invoice format."
            />
          )}
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          <ParserExplainer />
        </div>
      </div>
    </div>
  );
}
