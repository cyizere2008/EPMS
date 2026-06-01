import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const items = [
    { to: '/employees', label: 'Employees', icon: '👥' },
    { to: '/departments', label: 'Departments', icon: '🏢' },
    { to: '/salaries', label: 'Salaries', icon: '💰' },
    { to: '/reports', label: 'Reports', icon: '📊' },
  ];

  const handleLogout = () => { 
    logout(); 
    nav('/login'); 
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-slate-800 to-blue-800 text-white shadow-lg z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="text-center">
            <h1 className="text-lg font-bold">PayMaster EPMS</h1>
            <p className="text-xs text-blue-100 hidden xs:block">Employee Payroll System</p>
          </div>
          <div className="w-8"></div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-slate-800 to-blue-800 text-white shadow-2xl transition-all duration-300 z-50 flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 w-64 md:w-72`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 rounded-full p-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">PayMaster</h1>
              <p className="text-xs text-blue-200">EPMS v2.0</p>
            </div>
          </div>
          {/* Mobile close button */}
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* User Profile */}
        <div className="p-4 mx-3 mt-4 bg-white/10 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-slate-500 to-blue-500 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{user?.username || 'User'}</p>
              <p className="text-xs text-blue-200 truncate">Administrator</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => isMobile && setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
                ${loc.pathname === item.to 
                  ? 'bg-white text-slate-700 shadow-md' 
                  : 'hover:bg-white/10 hover:translate-x-1'
                }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className={`font-medium ${loc.pathname === item.to ? 'text-slate-700' : ''}`}>
                {item.label}
              </span>
              {loc.pathname === item.to && (
                <div className="ml-auto w-1.5 h-6 bg-blue-600 rounded-full"></div>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer / Logout Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-100 transition-all duration-200 group"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium">Logout</span>
            <span className="text-xs text-red-200 ml-auto">({user?.username})</span>
          </button>
          
          {/* Version info */}
          <p className="text-xs text-center text-blue-300 mt-4">
            © 2024 PayMaster Inc.
          </p>
        </div>
      </aside>

      {/* Main content spacer for sidebar */}
      <div className={`transition-all duration-300 ${!isMobile ? 'md:ml-72' : ''} ${isMobile ? 'mt-14' : ''}`}>
        {/* This div creates space for the sidebar and mobile header */}
      </div>
    </>
  );
}