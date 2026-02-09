import { useState, useEffect } from 'react';
import { expenseService } from '../../services/expenseService';
import { formatCurrency, getCurrentMonth } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    count: 0,
    monthlyTotal: 0,
  });
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const expenses = await expenseService.getAll();
      const { year, month } = getCurrentMonth();
      const monthlyReport = await expenseService.getMonthlyReport(year, month);

      setStats({
        total: expenses.reduce((sum, exp) => sum + exp.amount, 0),
        count: expenses.length,
        monthlyTotal: monthlyReport.total,
      });

      setRecentExpenses(expenses.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Expenses</h3>
          <p className="stat-value">{formatCurrency(stats.total)}</p>
          <span className="stat-label">{stats.count} expenses</span>
        </div>

        <div className="stat-card">
          <h3>This Month</h3>
          <p className="stat-value">{formatCurrency(stats.monthlyTotal)}</p>
          <span className="stat-label">Current month spending</span>
        </div>

        <div className="stat-card">
          <h3>Average</h3>
          <p className="stat-value">
            {formatCurrency(stats.count > 0 ? stats.total / stats.count : 0)}
          </p>
          <span className="stat-label">Per expense</span>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-btn" onClick={() => navigate('/expenses')}>
            ➕ Add Expense
          </button>
          <button className="action-btn" onClick={() => navigate('/reports')}>
            📊 View Reports
          </button>
          <button className="action-btn" onClick={() => navigate('/categories')}>
            📁 Manage Categories
          </button>
        </div>
      </div>

      <div className="recent-expenses">
        <h3>Recent Expenses</h3>
        {recentExpenses.length === 0 ? (
          <p className="empty-message">No expenses yet. Start tracking!</p>
        ) : (
          <div className="expense-preview-list">
            {recentExpenses.map((expense) => (
              <div key={expense._id} className="expense-preview">
                <div>
                  <strong>{expense.title}</strong>
                  <span className="expense-category-badge">{expense.category}</span>
                </div>
                <span className="expense-preview-amount">
                  {formatCurrency(expense.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;