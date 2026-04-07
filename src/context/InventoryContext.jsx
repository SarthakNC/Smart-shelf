import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { MOCK_INVENTORY } from '../lib/mock-data';
import * as api from '../lib/mock-api';
import { getDaysUntilExpiry, getItemStatus } from '../lib/utils';

const InventoryContext = createContext(null);

export function InventoryProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [kpis, setKpis] = useState({ totalItems: 0, nearExpiry: 0, expired: 0, lowStock: 0, stockAtRisk: 0 });
  const [alerts, setAlerts] = useState([]);

  // Initial load
  useEffect(() => {
    loadInventory();
  }, []);

  // Recalculate KPIs and alerts when items change
  useEffect(() => {
    if (items.length >= 0) {
      api.getKPIData(items).then(setKpis);
      api.getAlerts(items).then(setAlerts);
    }
  }, [items]);

  const loadInventory = useCallback(async () => {
    setLoading(true);
    try {
      const enriched = await api.fetchInventory(MOCK_INVENTORY);
      setItems(enriched);
    } catch {
      addToast('Failed to load inventory', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const addItem = useCallback(async (newItem) => {
    try {
      const created = await api.addItem(newItem);
      setItems(prev => [created, ...prev]);
      addToast(`${newItem.name} added to inventory`, 'success');
      return created;
    } catch {
      addToast('Failed to add item', 'error');
      return null;
    }
  }, []);

  const updateItem = useCallback(async (updatedItem) => {
    try {
      const updated = await api.updateItem(updatedItem);
      setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
      addToast(`${updatedItem.name} updated`, 'success');
      return updated;
    } catch {
      addToast('Failed to update item', 'error');
      return null;
    }
  }, []);

  const deleteItem = useCallback(async (itemId, itemName) => {
    try {
      await api.deleteItem(itemId);
      setItems(prev => prev.filter(i => i.id !== itemId));
      addToast(`${itemName} removed from inventory`, 'success');
    } catch {
      addToast('Failed to delete item', 'error');
    }
  }, []);

  const addBulkItems = useCallback(async (newItems) => {
    try {
      const created = [];
      for (const item of newItems) {
        const c = await api.addItem(item);
        created.push(c);
      }
      setItems(prev => [...created, ...prev]);
      addToast(`${newItems.length} items added to inventory`, 'success');
      return created;
    } catch {
      addToast('Failed to import items', 'error');
      return [];
    }
  }, []);

  const markSold = useCallback(async (itemId, qtyToDeduct) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    const newQty = Math.max(0, item.quantity - qtyToDeduct);
    const updated = { ...item, quantity: newQty };
    const result = await api.updateItem(updated);
    setItems(prev => prev.map(i => i.id === result.id ? result : i));
    addToast(`Sold ${qtyToDeduct} of ${item.name}`, 'success');
  }, [items]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const value = {
    items,
    loading,
    toasts,
    kpis,
    alerts,
    addItem,
    updateItem,
    deleteItem,
    addBulkItems,
    markSold,
    addToast,
    dismissToast,
    loadInventory,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error('useInventory must be used within InventoryProvider');
  return ctx;
}
