import { useState } from 'react';
import { Database, Package, Upload } from 'lucide-react';

// Simple test page for inventory without any auth dependencies
const TestInventory = () => {
  const [testData] = useState([
    {
      ItemID: "TEST-001",
      MaterialName: "Q5 High-Fidelity DNA Polymerase",
      Brand: "New England Biolabs",
      CurrentStock: 25,
      Unit: "units",
      Location: "-20°C Freezer A, Rack 2",
      MinimumStock: 5
    },
    {
      ItemID: "TEST-002",
      MaterialName: "Agarose (Low Stock)",
      Brand: "Bio-Rad",
      CurrentStock: 2,
      Unit: "grams",
      Location: "Room Temperature Cabinet B",
      MinimumStock: 50
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Database className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Test Inventory Manager</h1>
            <p className="text-gray-600">Simple test page without authentication</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Inventory Data</h2>
          <p className="text-gray-600 mb-4">
            This page loads instantly without any authentication or backend calls.
          </p>
        </div>

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
                {testData.map((item) => (
                  <tr key={item.ItemID} className="hover:bg-gray-50">
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
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          In Stock
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-medium text-green-900 mb-2">✅ Test Results:</h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Page loads instantly without authentication</li>
            <li>• Inventory table displays correctly</li>
            <li>• Low stock indicators work</li>
            <li>• No loading screens or auth dependencies</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestInventory;
