import { useState } from 'react';
import { ShoppingCart, Search, Package, AlertCircle, ExternalLink, Star } from 'lucide-react';
import { protocolAPI } from '../services/api';
import DNALoader from '../components/DNALoader';

const ProcureGen = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [procurementData, setProcurementData] = useState(null);
  
  const [formData, setFormData] = useState({
    materials_list: '',
    quantities: '',
    preferred_brands: '',
    budget_limit: '',
    urgency: 'standard',
    supplier_preference: 'any'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setProcurementData(null);

    try {
      const response = await protocolAPI.generateProcurement(formData);
      if (response.success) {
        setProcurementData(response.data);
      } else {
        setError(response.error || 'Failed to generate procurement analysis');
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderProcurementTable = (material) => {
    if (!material.vendors || material.vendors.length === 0) {
      return (
        <div className="text-center py-4 text-gray-500">
          No vendors found for this material
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vendor (Priority)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price/Unit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Link
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {material.vendors.map((vendor, index) => (
              <tr key={index} className={vendor.is_preferred ? 'bg-green-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {vendor.is_preferred && (
                      <Star className="w-4 h-4 text-yellow-500 mr-2" />
                    )}
                    <span className={vendor.is_preferred ? 'font-semibold text-green-800' : 'text-gray-900'}>
                      {vendor.vendor_name}
                    </span>
                    {vendor.is_preferred && (
                      <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        Preferred
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {vendor.product_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {vendor.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {vendor.size}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                  <a 
                    href={vendor.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center hover:text-blue-800"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View Product
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <DNALoader 
        isVisible={loading} 
        message="Searching lab suppliers and comparing prices..." 
        overlay={true}
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-green-600" />
            Procure-Gen: Lab Procurement & Inventory
          </h1>
          <p className="text-gray-600">
            Find and compare prices for laboratory materials from trusted suppliers. 
            Prioritize preferred brands and get the best deals for your research needs.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Materials List */}
            <div>
              <label className="label">
                Required Materials *
              </label>
              <textarea
                name="materials_list"
                value={formData.materials_list}
                onChange={handleInputChange}
                className="input"
                placeholder="Enter materials (one per line):
Q5 Polymerase
dNTP Mix
PCR Tubes
Agarose
TAE Buffer"
                rows="6"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                List each material on a separate line
              </p>
            </div>

            {/* Quantities */}
            <div>
              <label className="label">
                Quantities Needed *
              </label>
              <textarea
                name="quantities"
                value={formData.quantities}
                onChange={handleInputChange}
                className="input"
                placeholder="Enter quantities (matching order):
50 units
1 mL
500 tubes
100 g
1 L"
                rows="6"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Match the order of materials above
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Preferred Brands */}
            <div>
              <label className="label">
                Preferred Brands (Optional)
              </label>
              <textarea
                name="preferred_brands"
                value={formData.preferred_brands}
                onChange={handleInputChange}
                className="input"
                placeholder="Specify preferred brands:
Q5 Polymerase: New England Biolabs
dNTP Mix: Thermo Fisher
Agarose: Bio-Rad"
                rows="4"
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: Material: Preferred Brand
              </p>
            </div>

            {/* Budget Limit */}
            <div>
              <label className="label">
                Budget Limit (Optional)
              </label>
              <input
                type="text"
                name="budget_limit"
                value={formData.budget_limit}
                onChange={handleInputChange}
                className="input"
                placeholder="e.g., $500, €1000"
              />
              <p className="text-xs text-gray-500 mt-1">
                Set maximum budget for procurement
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Urgency */}
            <div>
              <label className="label">
                Urgency Level
              </label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleInputChange}
                className="select"
              >
                <option value="standard">Standard (5-7 days)</option>
                <option value="urgent">Urgent (1-2 days)</option>
                <option value="next_day">Next Day Delivery</option>
              </select>
            </div>

            {/* Supplier Preference */}
            <div>
              <label className="label">
                Supplier Preference
              </label>
              <select
                name="supplier_preference"
                value={formData.supplier_preference}
                onChange={handleInputChange}
                className="select"
              >
                <option value="any">Any Trusted Supplier</option>
                <option value="sigma">Sigma-Aldrich Priority</option>
                <option value="thermo">Thermo Fisher Priority</option>
                <option value="biorad">Bio-Rad Priority</option>
                <option value="neb">New England Biolabs Priority</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Search className="w-5 h-5 animate-pulse" />
                  <span>Searching Suppliers...</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  <span>Find Best Prices</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error Display */}
        {error && (
          <div className="card bg-red-50 border-red-200">
            <div className="flex items-start space-x-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-700" />
              </div>
              <div>
                <h3 className="font-medium text-red-900 mb-1">Procurement Search Failed</h3>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Display */}
        {procurementData && (
          <div className="space-y-6">
            {/* IMS Status Notice */}
            <div className="card bg-blue-50 border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Package className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">Inventory Status</h3>
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> The Inventory Management System (IMS) is pending setup. 
                    Proceeding with external vendor search for all items.
                  </p>
                </div>
              </div>
            </div>

            {/* Procurement Results */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-green-600" />
                Procurement & Pricing Analysis
              </h2>

              {/* Lab Preferences */}
              {procurementData.preferred_brands && (
                <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-medium text-green-900 mb-2">Lab Preference List:</h3>
                  <p className="text-sm text-green-800">{procurementData.preferred_brands}</p>
                </div>
              )}

              {/* Materials */}
              {procurementData.materials && procurementData.materials.map((material, index) => (
                <div key={index} className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Required Material: {material.name} 
                    <span className="text-sm font-normal text-gray-600 ml-2">
                      (Need: {material.quantity})
                    </span>
                  </h3>
                  
                  {renderProcurementTable(material)}
                  
                  {material.summary && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Summary:</strong> {material.summary}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {/* Total Cost Summary */}
              {procurementData.total_cost && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-medium text-green-900 mb-2">Cost Summary:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-green-700">Preferred Brands Total:</span>
                      <span className="font-semibold ml-2">{procurementData.total_cost.preferred}</span>
                    </div>
                    <div>
                      <span className="text-green-700">Lowest Cost Total:</span>
                      <span className="font-semibold ml-2">{procurementData.total_cost.lowest}</span>
                    </div>
                    <div>
                      <span className="text-green-700">Potential Savings:</span>
                      <span className="font-semibold ml-2 text-green-600">{procurementData.total_cost.savings}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="card bg-gray-50">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Package className="w-5 h-5 text-gray-600" />
            Procurement Tips
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start space-x-2">
              <span className="text-green-600 mt-0.5">•</span>
              <span>
                <strong>Bulk Orders:</strong> Consider ordering larger quantities for frequently used reagents to get better unit prices
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-600 mt-0.5">•</span>
              <span>
                <strong>Expiration Dates:</strong> Check expiration dates when ordering, especially for enzymes and sensitive reagents
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-600 mt-0.5">•</span>
              <span>
                <strong>Shipping Costs:</strong> Factor in shipping costs and minimum order requirements when comparing prices
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-600 mt-0.5">•</span>
              <span>
                <strong>Quality Assurance:</strong> Preferred brands are prioritized for consistency and reliability in your protocols
              </span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default ProcureGen;
