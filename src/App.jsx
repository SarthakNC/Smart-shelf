import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { InventoryProvider } from './context/InventoryContext';
import AppShell from './components/layout/AppShell';
import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage';
import InvoiceParserPage from './pages/InvoiceParserPage';
import FlashSalesPage from './pages/FlashSalesPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <InventoryProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/invoice-parser" element={<InvoiceParserPage />} />
            <Route path="/flash-sales" element={<FlashSalesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </InventoryProvider>
    </BrowserRouter>
  );
}
