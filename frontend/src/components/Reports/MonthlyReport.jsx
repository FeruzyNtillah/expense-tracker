import { useState, useEffect } from 'react';
import { expenseService } from '../../services/expenseService';
import { formatCurrency, getCurrentMonth } from '../../utils/formatters';
import CategoryChart from './CategoryChart';
import './Reports.css';

const MonthlyReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  useEffect(() => {
    loadReport();
  }, [selectedMonth]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const data = await expenseService.getMonthlyReport(
        selectedMonth.year,
        selectedMonth.month
      );
      setReport(data);
    } catch (err) {
      console.error('Failed to load report', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (e) => {
    const [year, month] = e.target.value.split('-');
    setSelectedMonth({ year: parseInt(year), month: parseInt(month) });
  };

  const getCurrentMonthValue = () => {
    return `${selectedMonth.year}-${String(selectedMonth.month).padStart(2, '0')}`;
  };

  if (loading) return <div className="loading">Loading report...</div>;

  return (
    <div className="report-container">
      <div className="report-header">
        <h2>Monthly Report</h2>
        <input
          type="month"
          value={getCurrentMonthValue()}
          onChange={handleMonthChange}
          className="month-selector"
        />
      </div>

      {report && (
        <>
          <div className="report-summary">
            <div className="summary-card">
              <h3>Total Spent</h3>
              <p className="summary-amount">{formatCurrency(report.total)}</p>
            </div>
            <div className="summary-card">
              <h3>Total Expenses</h3>
              <p className="summary-count">{report.count}</p>
            </div>
            <div className="summary-card">
              <h3>Average per Expense</h3>
              <p className="summary-average">
                {formatCurrency(report.count > 0 ? report.total / report.count : 0)}
              </p>
            </div>
          </div>

          <div className="category-breakdown">
            <h3>Spending by Category</h3>
            <CategoryChart data={report.byCategory} />
            
            <div className="category-list">
              {Object.entries(report.byCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount]) => (
                  <div key={category} className="category-row">
                    <span className="category-label">{category}</span>
                    <span className="category-amount">
                      {formatCurrency(amount)}
                    </span>
                    <span className="category-percentage">
                      ({Math.round((amount / report.total) * 100)}%)
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MonthlyReport;