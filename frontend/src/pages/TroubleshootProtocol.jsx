import { useState, useEffect } from 'react';
import { Loader2, Search, AlertCircle } from 'lucide-react';
import { protocolAPI } from '../services/api';
import ProtocolDisplay from '../components/ProtocolDisplay';

const TroubleshootProtocol = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [techniques, setTechniques] = useState([]);
  
  const [formData, setFormData] = useState({
    observed_problem: '',
    original_protocol: '',
    additional_details: '',
    technique: '',
    llm_provider: 'gemini'
  });

  useEffect(() => {
    loadTechniques();
  }, []);

  const loadTechniques = async () => {
    try {
      const data = await protocolAPI.getTechniques();
      setTechniques(data.techniques || []);
    } catch (err) {
      console.error('Failed to load techniques:', err);
    }
  };

  const handleChange = (e) => {
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
    setAnalysis(null);

    try {
      const response = await protocolAPI.troubleshootProtocol(formData);
      
      if (response.success) {
        setAnalysis(response.protocol);
      } else {
        setError(response.error || 'Failed to analyze protocol');
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Troubleshoot Protocol
        </h1>
        <p className="text-gray-600">
          Describe your failed experiment and get ranked suggestions for potential 
          causes and solutions. Upload details about your protocol and observed problems.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card space-y-6">
        <div className="space-y-6">
          {/* Observed Problem */}
          <div>
            <label className="label">
              Observed Problem *
            </label>
            <textarea
              name="observed_problem"
              value={formData.observed_problem}
              onChange={handleChange}
              placeholder="e.g., No PCR band visible on gel, only primer dimers present"
              className="textarea"
              rows="3"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Describe what went wrong with your experiment in detail
            </p>
          </div>

          {/* Original Protocol */}
          <div>
            <label className="label">
              Original Protocol Used *
            </label>
            <textarea
              name="original_protocol"
              value={formData.original_protocol}
              onChange={handleChange}
              placeholder="Paste your protocol here, including reagent volumes, temperatures, times, etc."
              className="textarea"
              rows="10"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Copy and paste the complete protocol you followed
            </p>
          </div>

          {/* Technique */}
          <div>
            <label className="label">
              Technique Used (Optional)
            </label>
            <select
              name="technique"
              value={formData.technique}
              onChange={handleChange}
              className="select"
            >
              <option value="">Select technique...</option>
              {techniques.map(tech => (
                <option key={tech.value} value={tech.value}>
                  {tech.label}
                </option>
              ))}
            </select>
          </div>

          {/* Additional Details */}
          <div>
            <label className="label">
              Additional Details (Optional)
            </label>
            <textarea
              name="additional_details"
              value={formData.additional_details}
              onChange={handleChange}
              placeholder="e.g., Template DNA A260/A280 ratio was 1.7, used fresh reagents, thermocycler calibrated last month..."
              className="textarea"
              rows="4"
            />
            <p className="text-sm text-gray-500 mt-1">
              Any other relevant information about reagents, equipment, or conditions
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary flex items-center space-x-2 px-8"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Analyze Problem</span>
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
              <h3 className="font-semibold text-red-900 mb-1">
                Error Analyzing Protocol
              </h3>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Display */}
      {analysis && (
        <ProtocolDisplay protocol={analysis} title="Troubleshooting Analysis" />
      )}

      {/* Tips */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-3">
          Tips for Better Troubleshooting
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span>
              Be as specific as possible about what you observed (e.g., &quot;faint band at 
              expected size&quot; vs &quot;no product&quot;)
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span>
              Include all reagent concentrations, temperatures, and times from your protocol
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span>
              Mention any deviations from standard procedures or unusual conditions
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span>
              Note the quality and source of your reagents (e.g., template DNA purity, 
              enzyme batch number)
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TroubleshootProtocol;
