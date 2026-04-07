import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useInventory } from '../../context/InventoryContext';
import { getStockRiskData, formatCurrency } from '../../lib/utils';
import { TrendingUp } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 text-sm">
      <p className="font-medium text-brand-slate mb-1">{label}</p>
      <p className="text-amber-600">{payload[0].value} items at risk</p>
      {payload[1] && (
        <p className="text-red-500">{formatCurrency(payload[1].value)} value at risk</p>
      )}
    </div>
  );
};

export default function StockRiskChart() {
  const { items } = useInventory();
  const data = getStockRiskData(items);

  return (
    <div className="card-base">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-amber-600" />
        </div>
        <h3 className="section-title">Stock Risk — Next 7 Days</h3>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#6B705C', fontSize: 12 }}
              axisLine={{ stroke: '#e5e5e5' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#6B705C', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="items"
              fill="#E07B39"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
