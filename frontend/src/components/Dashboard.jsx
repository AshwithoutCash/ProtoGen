import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { firebaseService } from '../services/firebaseService';
import { 
  User, Mail, Calendar, FlaskConical, Archive, Database, Activity, Dna, Bookmark, Shield, ShoppingCart, GitBranch
} from 'lucide-react';
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserStats = async () => {
      if (currentUser) {
        const statsResult = await firebaseService.getUserStats(currentUser.uid);
        if (statsResult.success) {
          setUserStats(statsResult.stats);
        }
      }
      setLoading(false);
    };

    loadUserStats();
  }, [currentUser]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bio-gradient-primary rounded-xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4">
            <Dna className="w-24 h-24" />
          </div>
          <div className="absolute bottom-4 left-4">
            <FlaskConical className="w-16 h-16" />
          </div>
        </div>
        <div className="relative flex items-center space-x-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt="Profile"
                className="w-16 h-16 rounded-full"
              />
            ) : (
              <User className="w-8 h-8" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome to your lab, {userProfile?.displayName || currentUser?.displayName || 'Researcher'}
            </h1>
            <p className="text-white/90 mt-1">
              Your molecular biology workspace is ready for discovery
            </p>
          </div>
        </div>
      </div>

      {/* User Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Researcher Profile */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-green-700" />
            </div>
            <h3 className="text-lg font-semibold" style={{color: 'var(--text-dark)'}}>Researcher Profile</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm" style={{color: 'var(--text-dark)'}}>
              <strong>Name:</strong> {userProfile?.displayName || currentUser?.displayName || 'Not set'}
            </p>
            <p className="text-sm" style={{color: 'var(--text-dark)'}}>
              <strong>Role:</strong> {userProfile?.role || 'Research Scientist'}
            </p>
          </div>
        </div>

        {/* Lab Access */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold" style={{color: 'var(--text-dark)'}}>Lab Access</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm" style={{color: 'var(--text-dark)'}}>
              <strong>Email:</strong> {currentUser?.email}
            </p>
            <p className="text-sm" style={{color: 'var(--text-dark)'}}>
              <strong>Verified:</strong> {currentUser?.emailVerified ? 'Active' : 'Pending'}
            </p>
          </div>
        </div>

        {/* Research Archive */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold" style={{color: 'var(--text-dark)'}}>Research Archive</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-slate-600">
              <strong>Protocols Saved:</strong> {loading ? '...' : (userStats?.totalSavedResults || 0)}
            </p>
            <p className="text-sm text-slate-600">
              <strong>Bookmarked:</strong> {loading ? '...' : (userStats?.totalBookmarks || 0)}
            </p>
          </div>
        </div>

        {/* Lab Membership */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold" style={{color: 'var(--text-dark)'}}>Lab Membership</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-slate-600">
              <strong>Member Since:</strong> {formatDate(userProfile?.createdAt)}
            </p>
            <p className="text-sm text-slate-600">
              <strong>Access Level:</strong> Full Research Access
            </p>
          </div>
        </div>
      </div>

      {/* Research Portfolio */}
      {userStats && userStats.totalSavedResults > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4" style={{color: 'var(--text-dark)'}}>Research Portfolio</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(userStats.resultsByType || {}).map(([type, count]) => (
              <div key={type} className="text-center p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                  {type === 'protocol' && <FlaskConical className="w-6 h-6 text-green-600" />}
                  {type === 'tools' && <Activity className="w-6 h-6 text-green-700" />}
                  {type === 'troubleshoot' && <User className="w-6 h-6 text-green-800" />}
                  {type === 'routes' && <Dna className="w-6 h-6 text-green-500" />}
                </div>
                <div className="text-lg font-semibold" style={{color: 'var(--text-dark)'}}>{count}</div>
                <div className="text-xs capitalize font-medium" style={{color: 'var(--text-muted)'}}>
                  {type === 'protocol' && 'Protocols'}
                  {type === 'tools' && 'Instruments'}
                  {type === 'troubleshoot' && 'Diagnostics'}
                  {type === 'routes' && 'Pathways'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
          <Link
            to="/generate"
            className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FlaskConical className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium text-gray-900">Generate Protocol</span>
          </Link>
          
          <Link
            to="/troubleshoot"
            className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
          >
            <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium text-gray-900">Troubleshoot</span>
          </Link>
          
          <Link
            to="/routes"
            className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <GitBranch className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium text-gray-900">Route Gen</span>
          </Link>
          
          <Link
            to="/tools"
            className="flex items-center space-x-3 p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium text-gray-900">Tool Gen</span>
          </Link>
          
          <Link
            to="/procure"
            className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium text-gray-900">Lab Procurement</span>
          </Link>
          
          <Link
            to="/inventory"
            className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Database className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium text-gray-900">Inventory Manager</span>
          </Link>
          
          <Link
            to="/saved"
            className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center">
              <Archive className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium text-gray-900">Archive</span>
          </Link>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="text-center py-8">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No recent activity yet.</p>
          <p className="text-sm text-gray-400 mt-2">
            Start by generating your first protocol!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
