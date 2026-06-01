import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import Salaries from './pages/Salaries';
import Reports from './pages/Reports';
import { useAuth } from './context/AuthContext';

function Private({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function PageHeader() {
  const location = useLocation();
  const pageNames = {
    '/employees': 'Employees',
    '/departments': 'Departments',
    '/salaries': 'Salaries',
    '/reports': 'Reports',
    '/': 'Dashboard'
  };
  
  const currentPage = pageNames[location.pathname] || 'Dashboard';
  
  return (
    <div className="mb-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{currentPage}</h1>
      <p className="text-gray-500 text-sm mt-1">
        Manage and view all {currentPage.toLowerCase()} information
      </p>
    </div>
  );
}

export default function App() {
  const { user } = useAuth();
  
  // If user is not logged in, show centered auth pages
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    );
  }

  // If user is logged in, show layout with sidebar
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1 transition-all duration-300 overflow-x-auto">
        <div className="p-4 md:p-6 lg:p-8">
          <PageHeader />
          <Routes>
            <Route path="/" element={
              <Private>
                <Employees />
              </Private>
            } />
            <Route path="/employees" element={
              <Private>
                <Employees />
              </Private>
            } />
            <Route path="/departments" element={
              <Private>
                <Departments />
              </Private>
            } />
            <Route path="/salaries" element={
              <Private>
                <Salaries />
              </Private>
            } />
            <Route path="/reports" element={
              <Private>
                <Reports />
              </Private>
            } />
            <Route path="*" element={<Navigate to="/employees" />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}