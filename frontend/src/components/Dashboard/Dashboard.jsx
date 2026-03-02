import { useState, useEffect } from 'react';
import { expenseService } from '../../services/expenseService';
import { formatCurrency, getCurrentMonth } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Wallet, TrendingUp, Receipt, Plus, BarChart3, FolderOpen, Loader2 } from 'lucide-react';

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">Welcome back! Here's your expense overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-linear-to-br from-card to-card/50 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
              <Wallet className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{formatCurrency(stats.total)}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {stats.count} {stats.count === 1 ? 'expense' : 'expenses'} recorded
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-linear-to-br from-card to-card/50 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
            <div className="p-2 rounded-lg bg-green-500/10 text-green-600 group-hover:bg-green-500/20 transition-colors">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{formatCurrency(stats.monthlyTotal)}</div>
            <p className="text-sm text-muted-foreground mt-1">Current month spending</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-linear-to-br from-card to-card/50 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average</CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 group-hover:bg-blue-500/20 transition-colors">
              <Receipt className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {formatCurrency(stats.count > 0 ? stats.total / stats.count : 0)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Per expense</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 bg-linear-to-br from-card to-card/50 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Quick Actions</CardTitle>
          <CardDescription className="text-base">Common tasks to manage your expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => navigate('/expenses')} className="flex items-center gap-2 shadow-lg hover:shadow-xl">
              <Plus className="h-4 w-4" />
              Add Expense
            </Button>
            <Button variant="outline" onClick={() => navigate('/reports')} className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all duration-200">
              <BarChart3 className="h-4 w-4" />
              View Reports
            </Button>
            <Button variant="outline" onClick={() => navigate('/categories')} className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all duration-200">
              <FolderOpen className="h-4 w-4" />
              Manage Categories
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Expenses */}
      <Card className="border-0 bg-linear-to-br from-card to-card/50 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Recent Expenses</CardTitle>
          <CardDescription className="text-base">Your latest transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {recentExpenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 rounded-full bg-muted/50 mb-4">
                <Receipt className="h-12 w-12 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-lg mb-2">No expenses yet</p>
              <p className="text-muted-foreground text-sm mb-6">Start tracking your expenses today!</p>
              <Button onClick={() => navigate('/expenses')} className="shadow-lg hover:shadow-xl">
                Add Your First Expense
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentExpenses.map((expense) => (
                <div
                  key={expense._id}
                  className="flex items-center justify-between p-4 rounded-xl border bg-card/50 hover:bg-card hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
                >
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{expense.title}</span>
                    <Badge variant="secondary" className="w-fit">
                      {expense.category}
                    </Badge>
                  </div>
                  <span className="text-xl font-bold text-foreground">
                    {formatCurrency(expense.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;