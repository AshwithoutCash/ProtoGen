import { useState } from 'react';
import { Upload, Database, AlertTriangle, CheckCircle, FileText, Package, Search, Download } from 'lucide-react';
import { protocolAPI } from '../services/api';
import DNALoader from '../components/DNALoader';

const IMSGen = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [inventoryData, setInventoryData] = useState([]);
  const [viewMode, setViewMode] = useState('upload'); // 'upload', 'view', 'search'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (validTypes.includes(file.type)) {
        setSelectedFile(file);
        setError(null);
      } else {
        setError('Please select a valid CSV or Excel file (.csv, .xls, .xlsx)');
        setSelectedFile(null);
      }
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError(null);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('processing_agent', 'llama');
      formData.append('database_target', 'firebase');

      const response = await protocolAPI.uploadInventory(formData);

      if (response.success) {
        setUploadResult(response.data);
        setViewMode('view');
        // Refresh inventory data
        await loadInventoryData();
      } else {
        setError(response.error || 'Failed to process inventory file');
      }
    } catch (err) {
      setError(`Upload failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadInventoryData = async () => {
    try {
      const response = await protocolAPI.getInventory();
      if (response.success) {
        setInventoryData(response.data.items || []);
      }
    } catch (err) {
      console.error('Failed to load inventory:', err);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      await loadInventoryData();
      return;
    }

    try {
      const response = await protocolAPI.searchInventory(searchTerm);
      if (response.success) {
        setInventoryData(response.data.items || []);
      }
    } catch (err) {
      setError(`Search failed: ${err.message}`);
    }
  };

  const getLowStockItems = () => {
    return inventoryData.filter(item => 
      item.CurrentStock <= item.MinimumStock
    );
  };

  const filteredInventory = inventoryData.filter(item =>
    item.MaterialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.Brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.Location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <DNALoader visible={loading} overlay={true} />
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Database className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Firebase Inventory Manager</h1>
            <p className="text-gray-600">IMS-Gen - Intelligent inventory management with Llama processing</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setViewMode('upload')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'upload'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Upload className="w-4 h-4 inline mr-2" />
            Upload Data
          </button>
          <button
            onClick={() => {
              setViewMode('view');
              loadInventoryData();
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'view'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Package className="w-4 h-4 inline mr-2" />
            View Inventory
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Upload Mode */}
        {viewMode === 'upload' && (
          <div className="space-y-6">
            {/* File Upload Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Inventory Data</h2>
              <p className="text-gray-600 mb-6">
                Upload your inventory data in CSV or Excel format. Llama LLM will automatically normalize and structure the data for Firebase storage.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select File (CSV, XLS, XLSX)
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept=".csv,.xls,.xlsx"
                      onChange={handleFileSelect}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    />
                    {selectedFile && (
                      <div className="flex items-center text-sm text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        {selectedFile.name}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleFileUpload}
                  disabled={!selectedFile || loading}
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  <Upload className="w-5 h-5" />
                  <span>Process with Llama & Upload to Firebase</span>
                </button>
              </div>
            </div>

            {/* Processing Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">How IMS-Gen Works:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Step 1:</strong> Upload your raw inventory CSV/Excel file</li>
                <li>• <strong>Step 2:</strong> Llama LLM normalizes and structures the data</li>
                <li>• <strong>Step 3:</strong> Processed data is stored in Firebase Firestore</li>
                <li>• <strong>Step 4:</strong> Integration with Procure-Gen for availability checks</li>
              </ul>
            </div>

            {/* Upload Result */}
            {uploadResult && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-900">Upload Successful!</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-green-800">Items Processed:</span>
                    <span className="ml-2 text-green-700">{uploadResult.items_processed}</span>
                  </div>
                  <div>
                    <span className="font-medium text-green-800">Processing Time:</span>
                    <span className="ml-2 text-green-700">{uploadResult.processing_time}</span>
                  </div>
                  <div>
                    <span className="font-medium text-green-800">Database Status:</span>
                    <span className="ml-2 text-green-700">{uploadResult.database_status}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* View Mode */}
        {viewMode === 'view' && (
          <div className="space-y-6">
            {/* Search and Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Current Inventory</h2>
                  <p className="text-gray-600">Total items: {inventoryData.length}</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search inventory..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Low Stock Alert */}
            {getLowStockItems().length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-medium text-yellow-900">Low Stock Alert</h3>
                </div>
                <p className="text-sm text-yellow-800">
                  {getLowStockItems().length} items are running low on stock
                </p>
              </div>
            )}

            {/* Inventory Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Material
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Brand
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredInventory.map((item, index) => (
                      <tr key={item.ItemID || index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.MaterialName}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {item.ItemID}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.Brand}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {item.CurrentStock} {item.Unit}
                          </div>
                          <div className="text-xs text-gray-500">
                            Min: {item.MinimumStock} {item.Unit}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.Location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.CurrentStock <= item.MinimumStock ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Low Stock
                            </span>
                          ) : item.CurrentStock <= item.MinimumStock * 2 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Warning
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              In Stock
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredInventory.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No inventory items found</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Upload your first inventory file to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IMSGen;
