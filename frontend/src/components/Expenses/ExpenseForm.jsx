import { useState, useEffect } from 'react';
import { expenseService } from '../../services/expenseService';
import { categoryService } from '../../services/categoryService';
import { formatDateInput } from '../../utils/formatters';
import './Expenses.css';

const ExpenseForm = ({ expense, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: formatDateInput(new Date()),
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
    
    if (expense) {
      setFormData({
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        date: formatDateInput(expense.date),
      });
    }
  }, [expense]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (expense) {
        await expenseService.update(expense._id, formData);
      } else {
        await expenseService.create(formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="expense-form-container">
      <h3>{expense ? 'Edit Expense' : 'Add New Expense'}</h3>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Grocery Shopping"
            required
          />
        </div>

        <div className="form-group">
          <label>Amount (TZS/=)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            min="0.01"
            placeholder="0.00"
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : expense ? 'Update' : 'Add Expense'}
          </button>
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;