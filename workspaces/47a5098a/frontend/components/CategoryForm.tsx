'use client';

import { useState, useEffect } from 'react';
import { Category, CategoryFormValues, TransactionType } from '@/types';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface CategoryFormProps {
  categories: Category[];
  onSubmit: (values: CategoryFormValues) => void;
  onClose: () => void;
  initialData?: Category | null;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
}

export default function CategoryForm({
  categories,
  onSubmit,
  onClose,
  initialData,
  onEdit,
  onDelete,
}: CategoryFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [type, setType] = useState<TransactionType>(initialData?.type || 'expense');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setType(initialData.type);
    } else {
      setName('');
      setType('expense');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Category name cannot be empty.');
      return;
    }

    onSubmit({ name: name.trim(), type });
    // Clear form after submission for 'add' scenario
    if (!initialData) {
      setName('');
      setType('expense');
    }
  };

  const incomeCategories = categories.filter(cat => cat.type === 'income');
  const expenseCategories = categories.filter(cat => cat.type === 'expense');

  return (
    <div className="w-full max-w-md">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">
        {initialData ? 'Edit Category' : 'Add New Category'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="categoryName">Category Name</label>
          <input
            id="categoryName"
            type="text"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="categoryType">Type</label>
          <select
            id="categoryType"
            className="select"
            value={type}
            onChange={(e) => setType(e.target.value as TransactionType)}
            required
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        {error && <p className="mb-4 text-red-500">{error}</p>}

        <div className="mt-6 flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {initialData ? 'Save Changes' : 'Add Category'}
          </button>
        </div>
      </form>

      <div className="mt-8">
        <h3 className="mb-4 text-xl font-bold text-gray-800">Existing Categories</h3>
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <div className="w-full md:w-1/2">
            <h4 className="mb-2 text-lg font-semibold text-green-700">Income Categories</h4>
            {incomeCategories.length === 0 ? (
              <p className="text-gray-500 text-sm">No income categories yet.</p>
            ) : (
              <ul className="space-y-2">
                {incomeCategories.map((cat) => (
                  <li key={cat.id} className="flex items-center justify-between rounded-md bg-green-50 p-3 text-green-800">
                    <span>{cat.name}</span>
                    <div className="flex space-x-2">
                      <button onClick={() => onEdit(cat)} className="btn btn-icon btn-secondary p-1" title="Edit Category"><PencilIcon className="h-4 w-4" /></button>
                      <button onClick={() => onDelete(cat.id)} className="btn btn-icon btn-danger p-1" title="Delete Category"><TrashIcon className="h-4 w-4" /></button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="w-full md:w-1/2">
            <h4 className="mb-2 text-lg font-semibold text-red-700">Expense Categories</h4>
            {expenseCategories.length === 0 ? (
              <p className="text-gray-500 text-sm">No expense categories yet.</p>
            ) : (
              <ul className="space-y-2">
                {expenseCategories.map((cat) => (
                  <li key={cat.id} className="flex items-center justify-between rounded-md bg-red-50 p-3 text-red-800">
                    <span>{cat.name}</span>
                    <div className="flex space-x-2">
                      <button onClick={() => onEdit(cat)} className="btn btn-icon btn-secondary p-1" title="Edit Category"><PencilIcon className="h-4 w-4" /></button>
                      <button onClick={() => onDelete(cat.id)} className="btn btn-icon btn-danger p-1" title="Delete Category"><TrashIcon className="h-4 w-4" /></button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
