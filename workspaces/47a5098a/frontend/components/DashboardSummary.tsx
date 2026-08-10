import { DashboardSummary as DashboardSummaryType } from '@/types';

interface DashboardSummaryProps {
  summary: DashboardSummaryType;
}

export default function DashboardSummary({ summary }: DashboardSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-2 text-lg font-semibold text-gray-600">Total Income</h3>
        <p className="text-3xl font-bold text-green-600">
          {formatCurrency(summary.total_income)}
        </p>
      </div>
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-2 text-lg font-semibold text-gray-600">Total Expenses</h3>
        <p className="text-3xl font-bold text-red-600">
          {formatCurrency(summary.total_expenses)}
        </p>
      </div>
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-2 text-lg font-semibold text-gray-600">Current Balance</h3>
        <p className={`text-3xl font-bold ${summary.current_balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
          {formatCurrency(summary.current_balance)}
        </p>
      </div>
    </div>
  );
}
