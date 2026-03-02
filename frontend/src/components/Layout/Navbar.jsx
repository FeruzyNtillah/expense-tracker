import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/button';
import { Wallet, LayoutDashboard, Receipt, FolderOpen, BarChart3, LogOut, User, Sun, Moon, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3 text-xl font-bold bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent hover:from-primary/90 hover:to-primary/70 transition-all duration-300">
            <div className="p-2 rounded-lg bg-linear-to-br from-primary to-primary/80 text-white shadow-lg">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="hidden sm:inline">Expense Tracker</span>
            <span className="sm:hidden">Expenses</span>
          </Link>

          {isAuthenticated && (
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="md:hidden flex items-center gap-2 hover:bg-primary/10 hover:text-primary"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>

              {/* Desktop navigation */}
              <div className="hidden md:flex items-center gap-1">
                <Button variant="ghost" asChild className="hover:bg-primary/10 hover:text-primary">
                  <Link to="/dashboard" className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="hover:bg-primary/10 hover:text-primary">
                  <Link to="/expenses" className="flex items-center gap-2">
                    <Receipt className="h-4 w-4" />
                    <span>Expenses</span>
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="hover:bg-primary/10 hover:text-primary">
                  <Link to="/categories" className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4" />
                    <span>Categories</span>
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="hover:bg-primary/10 hover:text-primary">
                  <Link to="/reports" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>Reports</span>
                  </Link>
                </Button>
              </div>

              {/* Theme toggle - always visible */}
              <Button variant="ghost" size="sm" onClick={toggleTheme} className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-all duration-200">
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <span className="hidden sm:inline">{theme === 'light' ? 'Dark' : 'Light'}</span>
              </Button>

              {/* User menu - desktop only */}
              <div className="hidden md:flex items-center gap-3 border-l pl-6">
                <div className="flex items-center gap-2 text-sm">
                  <div className="p-1.5 rounded-full bg-muted">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="font-medium text-foreground">{user?.name}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all duration-200">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && isAuthenticated && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur">
            <div className="py-4 space-y-2">
              <Button variant="ghost" asChild className="w-full justify-start hover:bg-primary/10 hover:text-primary" onClick={closeMobileMenu}>
                <Link to="/dashboard" className="flex items-center gap-3">
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
              </Button>
              <Button variant="ghost" asChild className="w-full justify-start hover:bg-primary/10 hover:text-primary" onClick={closeMobileMenu}>
                <Link to="/expenses" className="flex items-center gap-3">
                  <Receipt className="h-5 w-5" />
                  <span>Expenses</span>
                </Link>
              </Button>
              <Button variant="ghost" asChild className="w-full justify-start hover:bg-primary/10 hover:text-primary" onClick={closeMobileMenu}>
                <Link to="/categories" className="flex items-center gap-3">
                  <FolderOpen className="h-5 w-5" />
                  <span>Categories</span>
                </Link>
              </Button>
              <Button variant="ghost" asChild className="w-full justify-start hover:bg-primary/10 hover:text-primary" onClick={closeMobileMenu}>
                <Link to="/reports" className="flex items-center gap-3">
                  <BarChart3 className="h-5 w-5" />
                  <span>Reports</span>
                </Link>
              </Button>
              
              <div className="border-t pt-4 mt-4 space-y-2">
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="p-1.5 rounded-full bg-muted">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="font-medium text-foreground">{user?.name}</span>
                </div>
                <Button variant="outline" onClick={handleLogout} className="w-full justify-start hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all duration-200">
                  <LogOut className="h-4 w-4 mr-3" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;