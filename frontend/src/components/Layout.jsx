import { Link, useLocation } from 'react-router-dom';
import { Beaker, Home, FileText, AlertCircle, Route, Monitor } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Beaker className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Proto-Gen</h1>
                <p className="text-xs text-gray-500">AI Lab Protocol Assistant</p>
              </div>
            </Link>

            <nav className="flex space-x-1">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/')
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Home className="w-4 h-4" />
                <span className="font-medium">Home</span>
              </Link>
              <Link
                to="/generate"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/generate')
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span className="font-medium">Generate</span>
              </Link>
              <Link
                to="/troubleshoot"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/troubleshoot')
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">Troubleshoot</span>
              </Link>
              <Link
                to="/routes"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/routes')
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Route className="w-4 h-4" />
                <span className="font-medium">Route-Gen</span>
              </Link>
              <Link
                to="/tools"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/tools')
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span className="font-medium">Tool-Gen</span>
              </Link>
            </nav>
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
