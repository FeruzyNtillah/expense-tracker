import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { Wallet, LayoutDashboard, Receipt, FolderOpen, BarChart3, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold text-primary hover:text-primary/80 transition-colors">
            <Wallet className="h-6 w-6" />
            <span>Expense Tracker</span>
          </Link>

          {isAuthenticated && (
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-1">
                <Button variant="ghost" asChild>
                  <Link to="/dashboard" className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/expenses" className="flex items-center gap-2">
                    <Receipt className="h-4 w-4" />
                    Expenses
                  </Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/categories" className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4" />
                    Categories
                  </Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/reports" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Reports
                  </Link>
                </Button>
              </div>

              <div className="flex items-center gap-3 border-l pl-6">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{user?.name}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;