'use client';

import { useState, useEffect, useMemo } from 'react';
import { Transaction, Category, TransactionFormValues, TransactionType } from '@/types';

interface TransactionFormProps {
  categories: Category[];
  onSubmit: (values: TransactionFormValues) => void;
  onClose: () => void;
  initialData?: Transaction | null;
}

export default function TransactionForm({
  categories,
  onSubmit,
  onClose,
  initialData,
}: TransactionFormProps) {
  const [amount, setAmount] = useState(initialData?.amount || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [transactionDate, setTransactionDate] = useState(initialData?.transaction_date || new Date().toISOString().split('T')[0]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialData?.category_id || '');
  const [selectedType, setSelectedType] = useState<TransactionType>(initialData?.type || 'expense');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount);
      setDescription(initialData.description || '');
      setTransactionDate(initialData.transaction_date);
      setSelectedCategoryId(initialData.category_id);
      setSelectedType(initialData.type);
    } else {
      // Reset form for new transaction
      setAmount('');
      setDescription('');
      setTransactionDate(new Date().toISOString().split('T')[0]);
      setSelectedCategoryId('');
      setSelectedType('expense');
    }
  }, [initialData]);

  const availableCategories = useMemo(() => {
    return categories.filter(cat => cat.type === selectedType);
  }, [categories, selectedType]);

  // Auto-select first category if current selected is invalid for new type
  useEffect(() => {
    if (!availableCategories.some(cat => cat.id === selectedCategoryId) && availableCategories.length > 0) {
      setSelectedCategoryId(availableCategories[0].id);
    }
    if (availableCategories.length === 0) {
      setSelectedCategoryId('');
    }
  }, [availableCategories, selectedCategoryId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!amount || parseFloat(amount.toString()) <= 0) {
      setError('Amount must be a positive number.');
      return;
    }
    if (!selectedCategoryId) {
      setError('Please select a category.');
      return;
    }
    if (!transactionDate) {
      setError('Please select a transaction date.');
      return;
    }

    const values: TransactionFormValues = {
      amount: parseFloat(amount.toString()),
      description,
      transaction_date: transactionDate,
      category_id: selectedCategoryId,
      type: selectedType,
    };
    onSubmit(values);
  };

  return (
    <div className="w-full max-w-lg">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">
        {initialData ? 'Edit Transaction' : 'Add New Transaction'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="type">Type</label>
          <select
            id="type"
            className="select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as TransactionType)}
            required
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            className="select"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {availableCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {availableCategories.length === 0 && (
            <p className="mt-2 text-sm text-red-500">No {selectedType} categories found. Please add one.</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            className="input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="transactionDate">Date</label>
          <input
            id="transactionDate"
            type="date"
            className="input"
            value={transactionDate}
            onChange={(e) => setTransactionDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (Optional)</label>
          <textarea
            id="description"
            rows={3}
            className="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        {error && <p className="mb-4 text-red-500">{error}</p>}

        <div className="mt-6 flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {initialData ? 'Save Changes' : 'Add Transaction'}
          </button>
        </div>
      </form>
    </div>
  );
}
