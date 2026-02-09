import { useState, useEffect } from 'react';
import { expenseService } from '../../services/expenseService';
import ExpenseItem from './ExpenseItem';
import ExpenseForm from './ExpenseForm';
import { formatCurrency } from '../../utils/formatters';
import './Expenses.css';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const data = await expenseService.getAll();
      setExpenses(data);
    } catch (err) {
      setError('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseService.delete(id);
        loadExpenses();
      } catch (err) {
        alert('Failed to delete expense');
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingExpense(null);
    loadExpenses();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingExpense(null);
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  if (loading) return <div className="loading">Loading expenses...</div>;

  return (
    <div className="expense-list-container">
      <div className="expense-header">
        <div>
          <h2>My Expenses</h2>
          <p className="expense-total">
            Total: {formatCurrency(totalExpenses)} ({expenses.length} expenses)
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✖ Close' : '➕ Add Expense'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <ExpenseForm
          expense={editingExpense}
          onSuccess={handleFormSuccess}
          onCancel={handleCancel}
        />
      )}

      <div className="expense-list">
        {expenses.length === 0 ? (
          <div className="empty-state">
            <p>No expenses yet. Add your first expense!</p>
          </div>
        ) : (
          expenses.map((expense) => (
            <ExpenseItem
              key={expense._id}
              expense={expense}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ExpenseList;