// components/Product/ProductForm.js
import { useState, useEffect } from 'react';

export default function ProductForm({ initialData }) {
  const [formData, setFormData] = useState({
    documentId: '',
    category: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Initialize form with safe optional chaining
  useEffect(() => {
    if (initialData) {
      setFormData({
        documentId: initialData?._id || '',
        category: initialData?.category?._ref || ''
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch('/api/sanity/write', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: formData.documentId,
          updates: {
            category: formData.category ? {
              _type: 'reference',
              _ref: formData.category
            } : null
          }
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update product');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      console.log('Update successful:', data);

    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Product ID
        </label>
        <input
          type="text"
          value={formData.documentId}
          readOnly
          className="w-full p-2 bg-gray-50 border rounded-md text-gray-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Category
        </label>
        <select
          value={formData.category}
          onChange={(e) => setFormData(p => ({...p, category: e.target.value}))}
          className="w-full p-2 border rounded-md"
          required
        >
          <option value="">Select Category</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
        </select>
      </div>

      {error && (
        <div className="p-3 text-red-700 bg-red-50 rounded-md">
          Error: {error}
        </div>
      )}

      {success && (
        <div className="p-3 text-green-700 bg-green-50 rounded-md">
          Product updated successfully!
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Updating...' : 'Update Product'}
      </button>
    </form>
  );
}