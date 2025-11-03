import { useState, useEffect } from 'react';
import { Bookmark, Save, Trash2, Eye, Download, Filter, Search, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { firebaseService } from '../services/firebaseService';
import ProtocolDisplay from '../components/ProtocolDisplay';
import DNALoader from '../components/DNALoader';

const SavedResults = () => {
  const { currentUser } = useAuth();
  const [savedResults, setSavedResults] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('results'); // 'results' or 'bookmarks'
  const [selectedResult, setSelectedResult] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    loadUserData();
  }, [currentUser]);

  const loadUserData = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const [resultsResponse, bookmarksResponse] = await Promise.all([
        firebaseService.getSavedResults(currentUser.uid),
        firebaseService.getUserBookmarks(currentUser.uid)
      ]);

      if (resultsResponse.success) {
        setSavedResults(resultsResponse.results);
      }

      if (bookmarksResponse.success) {
        setBookmarks(bookmarksResponse.bookmarks);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, isBookmark = false) => {
    if (!currentUser) return;

    try {
      let result;
      if (isBookmark) {
        result = await firebaseService.deleteBookmark(currentUser.uid, id);
        if (result.success) {
          setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
        }
      } else {
        result = await firebaseService.deleteSavedResult(currentUser.uid, id);
        if (result.success) {
          setSavedResults(savedResults.filter(savedResult => savedResult.id !== id));
        }
      }

      // Log activity
      await firebaseService.logActivity(currentUser.uid, {
        action: isBookmark ? 'bookmark_deleted' : 'result_deleted',
        itemId: id
      });
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    
    let date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else {
      date = new Date(timestamp);
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFilteredAndSortedData = () => {
    const data = activeTab === 'results' ? savedResults : bookmarks;
    
    let filtered = data;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.type === filterType);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      
      if (sortBy === 'newest') {
        return bDate - aDate;
      } else {
        return aDate - bDate;
      }
    });

    return filtered;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'protocol': return '🧪';
      case 'tools': return '🔧';
      case 'troubleshoot': return '🔍';
      case 'routes': return '🗺️';
      default: return '📄';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'protocol': return 'bg-blue-100 text-blue-800';
      case 'tools': return 'bg-green-100 text-green-800';
      case 'troubleshoot': return 'bg-yellow-100 text-yellow-800';
      case 'routes': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <DNALoader isVisible={true} message="Loading your research archive..." overlay={true} />;
  }

  const filteredData = getFilteredAndSortedData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          My Saved Results
        </h1>
        <p className="text-gray-600">
          Access all your saved protocols, tool recommendations, and bookmarks
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('results')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'results'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Save className="w-4 h-4" />
              <span>Saved Results ({savedResults.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'bookmarks'
                ? 'border-yellow-500 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Bookmark className="w-4 h-4" />
              <span>Bookmarks ({bookmarks.length})</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search your saved items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value="protocol">Protocols</option>
          <option value="tools">Tools</option>
          <option value="troubleshoot">Troubleshooting</option>
          <option value="routes">Routes</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Results Grid */}
      {filteredData.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            {activeTab === 'results' ? (
              <Save className="w-12 h-12 text-gray-400" />
            ) : (
              <Bookmark className="w-12 h-12 text-gray-400" />
            )}
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {activeTab === 'results' ? 'saved results' : 'bookmarks'} yet
          </h3>
          <p className="text-gray-500">
            Start saving your {activeTab === 'results' ? 'generated protocols and results' : 'favorite content'} to access them later
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item) => (
            <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getTypeIcon(item.type)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                    {item.type}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(item.id, activeTab === 'bookmarks')}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {item.title}
              </h3>

              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(item.createdAt)}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedResult(item)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </button>
                <button
                  onClick={() => {
                    const dataStr = JSON.stringify(item.content, null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${item.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
                    link.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for viewing selected result */}
      {selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedResult.title}
              </h2>
              <button
                onClick={() => setSelectedResult(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <ProtocolDisplay 
                protocol={selectedResult.content} 
                title={selectedResult.title}
                showCopy={true}
                showDownload={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedResults;
