import { formatCurrency, formatDate } from '../../utils/formatters';
import './Expenses.css';

const ExpenseItem = ({ expense, onEdit, onDelete }) => {
  return (
    <div className="expense-item">
      <div className="expense-info">
        <h4>{expense.title}</h4>
        <span className="expense-category">{expense.category}</span>
        <span className="expense-date">{formatDate(expense.date)}</span>
      </div>
      
      <div className="expense-actions">
        <span className="expense-amount">{formatCurrency(expense.amount)}</span>
        <button className="btn-edit" onClick={() => onEdit(expense)}>
          ✏️ Edit
        </button>
        <button className="btn-delete" onClick={() => onDelete(expense._id)}>
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default ExpenseItem;