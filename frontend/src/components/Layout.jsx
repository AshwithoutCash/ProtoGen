import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Dna, Home, FileText, Search, GitBranch, Microscope, User, LogOut, ChevronDown, Archive, AlertCircle, ShoppingCart, Database 
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { currentUser, userProfile, logout } = useAuth();
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/signin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bio-pattern">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-green-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bio-gradient-primary p-2.5 rounded-xl group-hover:scale-105 transition-transform duration-200">
                <Dna className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{color: 'var(--text-dark)'}}>Proto-Gen</h1>
                <p className="text-xs" style={{color: 'var(--text-muted)'}}>Molecular Biology Assistant</p>
              </div>
            </Link>

            <nav className="flex space-x-1">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive('/')
                    ? 'bg-green-100 text-green-800 shadow-sm'
                    : 'text-green-700 hover:bg-green-50 hover:text-green-800'
                }`}
              >
                <Home className="w-4 h-4" />
                <span className="font-medium">Lab</span>
              </Link>
              <Link
                to="/generate"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive('/generate')
                    ? 'bg-green-100 text-green-800 shadow-sm'
                    : 'text-green-700 hover:bg-green-50 hover:text-green-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span className="font-medium">Protocols</span>
              </Link>
              <Link
                to="/troubleshoot"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive('/troubleshoot')
                    ? 'bg-green-100 text-green-800 shadow-sm'
                    : 'text-green-700 hover:bg-green-50 hover:text-green-800'
                }`}
              >
                <Search className="w-4 h-4" />
                <span className="font-medium">Diagnostics</span>
              </Link>
              <Link
                to="/routes"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive('/routes')
                    ? 'bg-green-100 text-green-800 shadow-sm'
                    : 'text-green-700 hover:bg-green-50 hover:text-green-800'
                }`}
              >
                <GitBranch className="w-4 h-4" />
                <span className="font-medium">Pathways</span>
              </Link>
              <Link
                to="/tools"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive('/tools')
                    ? 'bg-green-100 text-green-800 shadow-sm'
                    : 'text-green-700 hover:bg-green-50 hover:text-green-800'
                }`}
              >
                <Microscope className="w-4 h-4" />
                <span className="font-medium">Instruments</span>
              </Link>
              <Link
                to="/procure"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive('/procure')
                    ? 'bg-green-100 text-green-800 shadow-sm'
                    : 'text-green-700 hover:bg-green-50 hover:text-green-800'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="font-medium">Procurement</span>
              </Link>
              <Link
                to="/inventory"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive('/inventory')
                    ? 'bg-green-100 text-green-800 shadow-sm'
                    : 'text-green-700 hover:bg-green-50 hover:text-green-800'
                }`}
              >
                <Database className="w-4 h-4" />
                <span className="font-medium">Inventory</span>
              </Link>
            </nav>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-all duration-200"
              >
                <div className="w-8 h-8 bio-gradient-secondary rounded-full flex items-center justify-center shadow-sm">
                  {currentUser?.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className="font-medium hidden sm:block text-slate-700">
                  {userProfile?.displayName || currentUser?.displayName || 'Researcher'}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-900">
                      {userProfile?.displayName || currentUser?.displayName || 'Researcher'}
                    </p>
                    <p className="text-xs text-slate-500">{currentUser?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-600">
              © 2024 Proto-Gen. AI-powered laboratory protocol assistant.
            </p>
            <div className="flex items-center space-x-2 text-sm text-amber-700 bg-amber-50 px-4 py-2 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium">
                Always verify protocols before use. Not a substitute for expert review.
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
