import { useState, useEffect } from 'react';
import { expenseService } from '../../services/expenseService';
import { categoryService } from '../../services/categoryService';
import { formatDateInput } from '../../utils/formatters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';
import { Button } from '../ui/button';
import { Loader2, AlertCircle, DollarSign, FileText, FolderOpen, Calendar } from 'lucide-react';

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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
        <CardTitle className="text-lg sm:text-xl">{expense ? 'Edit Expense' : 'Add New Expense'}</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          {expense ? 'Update the details of your expense' : 'Fill in the details to track a new expense'}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        {error && (
          <div className="flex items-start gap-2 p-3 mb-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span className="wrap-break-word">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">Title</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 sm:top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Grocery Shopping"
                className="pl-10 h-11 sm:h-9 text-base sm:text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">Amount (TZS/=)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 sm:top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                min="0.01"
                placeholder="0.00"
                className="pl-10 h-11 sm:h-9 text-base sm:text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">Category</Label>
            <div className="relative">
              <FolderOpen className="absolute left-3 top-3 sm:top-2.5 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
              <Select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="pl-10 h-11 sm:h-9 text-base sm:text-sm appearance-none"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium">Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 sm:top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="pl-10 h-11 sm:h-9 text-base sm:text-sm"
                required
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6">
            <Button type="submit" disabled={loading} className="flex-1 h-11 sm:h-9 text-base sm:text-sm">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                expense ? 'Update Expense' : 'Add Expense'
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto h-11 sm:h-9 text-base sm:text-sm">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;