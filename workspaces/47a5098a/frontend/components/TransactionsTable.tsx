'use client';

import { useState, useMemo } from 'react';
import { Transaction, Category, FilterOptions, TransactionType } from '@/types';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface TransactionsTableProps {
  transactions: Transaction[];
  categories: Category[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: string) => void;
  onApplyFilters: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

export default function TransactionsTable({
  transactions,
  categories,
  onEdit,
  onDelete,
  onApplyFilters,
  currentFilters,
}: TransactionsTableProps) {
  const [filterType, setFilterType] = useState<TransactionType | ''>(currentFilters.type || '');
  const [filterCategory, setFilterCategory] = useState<string>(currentFilters.categoryId || '');
  const [filterStartDate, setFilterStartDate] = useState<string>(currentFilters.startDate || '');
  const [filterEndDate, setFilterEndDate] = useState<string>(currentFilters.endDate || '');

  const incomeCategories = useMemo(() => categories.filter(cat => cat.type === 'income'), [categories]);
  const expenseCategories = useMemo(() => categories.filter(cat => cat.type === 'expense'), [categories]);

  const handleFilterChange = () => {
    onApplyFilters({
      type: filterType === '' ? undefined : filterType,
      categoryId: filterCategory === '' ? undefined : filterCategory,
      startDate: filterStartDate === '' ? undefined : filterStartDate,
      endDate: filterEndDate === '' ? undefined : filterEndDate,
    });
  };

  const handleClearFilters = () => {
    setFilterType('');
    setFilterCategory('');
    setFilterStartDate('');
    setFilterEndDate('');
    onApplyFilters({});
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  return (
    <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div>
          <label htmlFor="filterType" className="form-group">Type</label>
          <select
            id="filterType"
            className="select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as TransactionType | '')}
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div>
          <label htmlFor="filterCategory" className="form-group">Category</label>
          <select
            id="filterCategory"
            className="select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {(filterType === 'income' || filterType === '') && incomeCategories.map((category) => (
              <option key={category.id} value={category.id}>{category.name} (Income)</option>
            ))}
            {(filterType === 'expense' || filterType === '') && expenseCategories.map((category) => (
              <option key={category.id} value={category.id}>{category.name} (Expense)</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filterStartDate" className="form-group">Start Date</label>
          <input
            type="date"
            id="filterStartDate"
            className="input"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="filterEndDate" className="form-group">End Date</label>
          <input
            type="date"
            id="filterEndDate"
            className="input"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
          />
        </div>
        <div className="flex items-end space-x-2">
          <button onClick={handleFilterChange} className="btn btn-primary w-full md:w-auto">Apply Filters</button>
          <button onClick={handleClearFilters} className="btn btn-outline w-full md:w-auto">Clear</button>
        </div>
      </div>

      <div className="table-container max-h-[500px] overflow-y-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Category</th>
              <th>Description</th>
              <th className="text-right">Amount</th>
              <th className="w-24 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{new Date(transaction.transaction_date).toLocaleDateString()}</td>
                  <td>
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </span>
                  </td>
                  <td>{transaction.category?.name || 'N/A'}</td>
                  <td>{transaction.description || '-'}</td>
                  <td className="text-right font-medium">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="btn btn-icon btn-secondary p-1"
                      title="Edit Transaction"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(transaction.id)}
                      className="btn btn-icon btn-danger p-1"
                      title="Delete Transaction"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
