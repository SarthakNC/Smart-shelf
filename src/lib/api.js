// Real API client — replaces mock-api.js
// All functions match the same signatures used by InventoryContext, FlashSalesPage, and InvoiceParserPage

const API_BASE = '/api';

async function handleResponse(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || err.details || 'Request failed');
  }
  return res.json();
}

// ─── Inventory CRUD ──────────────────────────────────

export async function fetchInventory() {
  const res = await fetch(`${API_BASE}/items`);
  return handleResponse(res);
}

export async function addItem(newItem) {
  const res = await fetch(`${API_BASE}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newItem),
  });
  return handleResponse(res);
}

export async function updateItem(updatedItem) {
  const res = await fetch(`${API_BASE}/items/${updatedItem.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedItem),
  });
  return handleResponse(res);
}

export async function deleteItem(itemId) {
  const res = await fetch(`${API_BASE}/items/${itemId}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
}

export async function addBulkItems(items) {
  const res = await fetch(`${API_BASE}/items/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });
  return handleResponse(res);
}

// ─── Dashboard Analytics ─────────────────────────────

export async function getKPIData() {
  const res = await fetch(`${API_BASE}/dashboard/kpis`);
  return handleResponse(res);
}

export async function getAlerts() {
  const res = await fetch(`${API_BASE}/dashboard/alerts`);
  return handleResponse(res);
}

// ─── Flash Sales ─────────────────────────────────────

export async function getFlashSaleSuggestions() {
  const res = await fetch(`${API_BASE}/flash-sales/suggestions`);
  return handleResponse(res);
}

// ─── Invoice Parser ──────────────────────────────────

export async function parseInvoice(rawText, file = null) {
  let body, headers;

  if (file) {
    const formData = new FormData();
    if (rawText) formData.append('rawText', rawText);
    formData.append('invoiceFile', file);
    
    // When using FormData, omit Content-Type header so browser sets it with boundaries
    body = formData;
    headers = {};
  } else {
    body = JSON.stringify({ rawText });
    headers = { 'Content-Type': 'application/json' };
  }

  const res = await fetch(`${API_BASE}/invoice/parse`, {
    method: 'POST',
    headers,
    body,
  });
  return handleResponse(res);
}
