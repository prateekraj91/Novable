'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import DashboardSummary from '@/components/DashboardSummary';
import TransactionsTable from '@/components/TransactionsTable';
import Modal from '@/components/Modal';
import TransactionForm from '@/components/TransactionForm';
import CategoryForm from '@/components/CategoryForm';
import { apiRequest } from '@/lib/api';
import { Transaction, Category, DashboardSummary as DashboardSummaryType, TransactionFormValues, CategoryFormValues, FilterOptions, TransactionType } from '@/types';
import { PlusIcon, TagIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [summary, setSummary] = useState<DashboardSummaryType | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});

  const fetchDashboardData = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);
    try {
      const summaryData: DashboardSummaryType = await apiRequest('/dashboard/summary', { method: 'GET', body: filters });
      setSummary(summaryData);

      const transactionsData: Transaction[] = await apiRequest('/transactions', { method: 'GET', body: filters });
      setTransactions(transactionsData);

      const categoriesData: Category[] = await apiRequest('/categories');
      setCategories(categoriesData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard data.');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, filters]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchDashboardData();
    }
  }, [authLoading, isAuthenticated, fetchDashboardData]);

  const handleTransactionFormSubmit = async (values: TransactionFormValues) => {
    try {
      if (editingTransaction) {
        await apiRequest(`/transactions/${editingTransaction.id}`, { method: 'PUT', body: values });
      } else {
        await apiRequest('/transactions', { method: 'POST', body: values });
      }
      fetchDashboardData();
      setIsTransactionModalOpen(false);
      setEditingTransaction(null);
    } catch (err: any) {
      setError(err.message || 'Failed to save transaction.');
    }
  };

  const handleCategoryFormSubmit = async (values: CategoryFormValues) => {
    try {
      if (editingCategory) {
        await apiRequest(`/categories/${editingCategory.id}`, { method: 'PUT', body: values });
      } else {
        await apiRequest('/categories', { method: 'POST', body: values });
      }
      fetchDashboardData();
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
    } catch (err: any) {
      setError(err.message || 'Failed to save category.');
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsTransactionModalOpen(true);
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await apiRequest(`/transactions/${transactionId}`, { method: 'DELETE' });
        fetchDashboardData();
      } catch (err: any) {
        setError(err.message || 'Failed to delete transaction.');
      }
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category? (This will prevent deleting transactions associated with it unless changed first.)')) {
      try {
        await apiRequest(`/categories/${categoryId}`, { method: 'DELETE' });
        fetchDashboardData();
      } catch (err: any) {
        setError(err.message || 'Failed to delete category.');
      }
    }
  };

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
        <p className="text-lg font-semibold text-gray-700">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mt-8 text-center">
          <p className="text-lg font-semibold text-red-600">Error: {error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container py-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">Dashboard</h1>

        {summary && <DashboardSummary summary={summary} />}

        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Transactions</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => { setEditingCategory(null); setIsCategoryModalOpen(true); }}
              className="btn btn-secondary flex items-center"
            >
              <TagIcon className="mr-2 h-5 w-5" />
              Manage Categories
            </button>
            <button
              onClick={() => { setEditingTransaction(null); setIsTransactionModalOpen(true); }}
              className="btn btn-primary flex items-center"
            >
              <PlusIcon className="mr-2 h-5 w-5" />
              Add Transaction
            </button>
          </div>
        </div>

        <TransactionsTable
          transactions={transactions}
          categories={categories}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
          onApplyFilters={handleApplyFilters}
          currentFilters={filters}
        />
      </main>

      <Modal isOpen={isTransactionModalOpen} onClose={() => { setIsTransactionModalOpen(false); setEditingTransaction(null); }}>
        <TransactionForm
          categories={categories}
          onSubmit={handleTransactionFormSubmit}
          onClose={() => { setIsTransactionModalOpen(false); setEditingTransaction(null); }}
          initialData={editingTransaction}
        />
      </Modal>

      <Modal isOpen={isCategoryModalOpen} onClose={() => { setIsCategoryModalOpen(false); setEditingCategory(null); }}>
        <CategoryForm
          categories={categories}
          onSubmit={handleCategoryFormSubmit}
          onClose={() => { setIsCategoryModalOpen(false); setEditingCategory(null); }}
          initialData={editingCategory}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
        />
      </Modal>
    </div>
  );
}
