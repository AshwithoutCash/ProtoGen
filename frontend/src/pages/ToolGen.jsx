import { useState } from 'react';
import { Loader2, Monitor, Lightbulb } from 'lucide-react';
import { protocolAPI } from '../services/api';
import ProtocolDisplay from '../components/ProtocolDisplay';

const ToolGen = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  
  const [formData, setFormData] = useState({
    user_goal: '',
    technique: '',
    data_type: '',
    additional_context: '',
    llm_provider: 'gemini'
  });

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
    setRecommendations(null);

    try {
      const response = await protocolAPI.generateTools(formData);
      
      if (response.success) {
        setRecommendations(response.tools);
      } else {
        setError(response.error || 'Failed to generate tool recommendations');
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Monitor className="h-8 w-8 text-primary-600" />
          Tool-Gen: Computational Tools
        </h1>
        <p className="text-gray-600">
          Get targeted recommendations for computational biology software with step-by-step usage guides, 
          video tutorials, and expert selection based on relevance and accessibility.
        </p>
      </div>

      {/* Examples */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-900 mb-2">Example Tasks:</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <strong>Primer Design:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Goal: "Design PCR primers for gene amplification"</li>
                  <li>• Technique: "Primer Design"</li>
                  <li>• Data: "Target DNA sequence (500bp)"</li>
                </ul>
              </div>
              <div>
                <strong>Sequence Analysis:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Goal: "Align multiple protein sequences"</li>
                  <li>• Technique: "Multiple Sequence Alignment"</li>
                  <li>• Data: "FASTA protein sequences"</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 space-y-6">
        {/* Project Goal */}
        <div>
          <label className="label">
            Project Goal *
          </label>
          <input
            type="text"
            name="user_goal"
            value={formData.user_goal}
            onChange={handleChange}
            placeholder="e.g., Design primers for PCR amplification, Analyze RNA-seq data, Create phylogenetic tree"
            className="input"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Describe what you want to accomplish computationally
          </p>
        </div>

        {/* Technique/Step */}
        <div>
          <label className="label">
            Current Step/Technique *
          </label>
          <input
            type="text"
            name="technique"
            value={formData.technique}
            onChange={handleChange}
            placeholder="e.g., Primer Design, Sequence Alignment, Plasmid Mapping, NGS Analysis, Protein Modeling"
            className="input"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            The specific computational task you need to perform
          </p>
        </div>

        {/* Data Type */}
        <div>
          <label className="label">
            Input Data Type *
          </label>
          <input
            type="text"
            name="data_type"
            value={formData.data_type}
            onChange={handleChange}
            placeholder="e.g., DNA sequence, Protein FASTA, NGS reads, GenBank file, Mass spec data"
            className="input"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            What type of data will you be working with?
          </p>
        </div>

        {/* Additional Context */}
        <div>
          <label className="label">
            Additional Context (Optional)
          </label>
          <textarea
            name="additional_context"
            value={formData.additional_context}
            onChange={handleChange}
            placeholder="e.g., Need free tools only, Must work on Windows, Require batch processing, Need publication-quality figures"
            className="input min-h-[60px] resize-y"
          />
          <p className="text-sm text-gray-500 mt-1">
            Any specific requirements, constraints, or preferences
          </p>
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
                <Monitor className="w-5 h-5" />
                <span>Get Tool Recommendations</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-medium text-red-900 mb-2">Error Generating Recommendations</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Recommendations Display */}
      {recommendations && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Tool Recommendations
            </h2>
          </div>
          
          <ProtocolDisplay 
            protocol={recommendations} 
            title="Computational Tools"
            showCopy={true}
            showDownload={true}
          />
        </div>
      )}
    </div>
  );
};

export default ToolGen;
