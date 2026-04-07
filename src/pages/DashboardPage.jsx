import { Package, AlertTriangle, XCircle, TrendingDown, DollarSign } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { formatCurrency } from '../lib/utils';
import KPIStatCard from '../components/dashboard/KPIStatCard';
import QuickAddForm from '../components/dashboard/QuickAddForm';
import AlertPanel from '../components/dashboard/AlertPanel';
import TodaysActions from '../components/dashboard/TodaysActions';
import StockRiskChart from '../components/dashboard/StockRiskChart';
import FlashSalePreview from '../components/dashboard/FlashSalePreview';
import RecentActivity from '../components/dashboard/RecentActivity';
import LoadingSpinner from '../components/shared/LoadingSpinner';

export default function DashboardPage() {
  const { kpis, loading } = useInventory();

  if (loading) return <LoadingSpinner fullPage message="Loading dashboard..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-brand-green-dark">Dashboard</h1>
        <p className="text-sm text-brand-olive mt-1">Your store at a glance — what needs attention today</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <KPIStatCard
          icon={Package}
          label="Total Items"
          value={kpis.totalItems}
          sub="In inventory"
          color="green"
        />
        <KPIStatCard
          icon={AlertTriangle}
          label="Near Expiry"
          value={kpis.nearExpiry}
          sub="Within 7 days"
          color="orange"
        />
        <KPIStatCard
          icon={XCircle}
          label="Expired"
          value={kpis.expired}
          sub="Remove from shelf"
          color="red"
        />
        <KPIStatCard
          icon={TrendingDown}
          label="Low Stock"
          value={kpis.lowStock}
          sub="≤ 5 units left"
          color="blue"
        />
        <KPIStatCard
          icon={DollarSign}
          label="Stock at Risk"
          value={formatCurrency(kpis.stockAtRisk)}
          sub="Potential loss"
          color="red"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <AlertPanel />
          <StockRiskChart />
          <FlashSalePreview />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <QuickAddForm />
          <TodaysActions />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
