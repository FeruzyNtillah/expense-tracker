import { formatCurrency, formatDate } from '../../utils/formatters';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, Edit, Trash2 } from 'lucide-react';

const ExpenseItem = ({ expense, onEdit, onDelete }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-lg">{expense.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{expense.category}</Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(expense.date)}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{formatCurrency(expense.amount)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Button variant="outline" size="sm" onClick={() => onEdit(expense)} className="flex items-center gap-1">
            <Edit className="h-3 w-3" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(expense._id)} className="flex items-center gap-1 text-destructive hover:text-destructive">
            <Trash2 className="h-3 w-3" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseItem;