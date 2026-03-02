import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Layout/Navbar';
import PrivateRoute from './components/Layout/PrivateRoute';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import ExpenseList from './components/Expenses/ExpenseList';
import CategoryList from './components/Categories/CategoryList';
import MonthlyReport from './components/Reports/MonthlyReport';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App min-h-screen bg-linear-to-br from-background via-background to-muted/20">
            <Navbar />
            <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/expenses"
                  element={
                    <PrivateRoute>
                      <ExpenseList />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/categories"
                  element={
                    <PrivateRoute>
                      <CategoryList />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <PrivateRoute>
                      <MonthlyReport />
                    </PrivateRoute>
                  }
                />

                {/* Default Route */}
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;