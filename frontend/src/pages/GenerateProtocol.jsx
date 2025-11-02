import { useState, useEffect } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { protocolAPI } from '../services/api';
import ProtocolDisplay from '../components/ProtocolDisplay';

const GenerateProtocol = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [protocol, setProtocol] = useState(null);
  const [techniques, setTechniques] = useState([]);
  
  const [formData, setFormData] = useState({
    experimental_goal: '',
    technique: 'PCR',
    reagents: '',
    template_details: '',
    primer_details: '',
    amplicon_size: '',
    reaction_volume: '25',
    num_reactions: '1',
    other_params: '',
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
    setProtocol(null);

    try {
      const response = await protocolAPI.generateProtocol(formData);
      
      if (response.success) {
        setProtocol(response.protocol);
      } else {
        setError(response.error || 'Failed to generate protocol');
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
          Generate Protocol
        </h1>
        <p className="text-gray-600">
          Fill in the details below to generate a detailed laboratory protocol with 
          calculated reagent volumes and step-by-step instructions.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Experimental Goal */}
          <div className="md:col-span-2">
            <label className="label">
              Experimental Goal *
            </label>
            <input
              type="text"
              name="experimental_goal"
              value={formData.experimental_goal}
              onChange={handleChange}
              placeholder="e.g., Amplify a 700bp gene fragment for cloning"
              className="input"
              required
            />
          </div>

          {/* Technique */}
          <div>
            <label className="label">
              Core Technique *
            </label>
            <input
              type="text"
              name="technique"
              value={formData.technique}
              onChange={handleChange}
              placeholder="e.g., PCR, qPCR, Gibson Assembly, Miniprep"
              className="input"
              required
            />
          </div>

          {/* Reagents */}
          <div>
            <label className="label">
              Key Reagents/Enzymes *
            </label>
            <input
              type="text"
              name="reagents"
              value={formData.reagents}
              onChange={handleChange}
              placeholder="e.g., Q5 High-Fidelity DNA Polymerase"
              className="input"
              required
            />
          </div>

          {/* Template Details */}
          <div>
            <label className="label">
              Template Details *
            </label>
            <input
              type="text"
              name="template_details"
              value={formData.template_details}
              onChange={handleChange}
              placeholder="e.g., Human genomic DNA, 50 ng/µL"
              className="input"
              required
            />
          </div>

          {/* Primer Details */}
          <div>
            <label className="label">
              Primer/DNA Fragment Details
            </label>
            <input
              type="text"
              name="primer_details"
              value={formData.primer_details}
              onChange={handleChange}
              placeholder="e.g., Forward: ATGC..., Reverse: GCTA..."
              className="input"
            />
          </div>

          {/* Amplicon Size */}
          <div>
            <label className="label">
              Amplicon Size
            </label>
            <input
              type="text"
              name="amplicon_size"
              value={formData.amplicon_size}
              onChange={handleChange}
              placeholder="e.g., 700 bp"
              className="input"
            />
          </div>

          {/* Reaction Volume */}
          <div>
            <label className="label">
              Reaction Volume (µL)
            </label>
            <input
              type="text"
              name="reaction_volume"
              value={formData.reaction_volume}
              onChange={handleChange}
              placeholder="25"
              className="input"
            />
          </div>

          {/* Number of Reactions */}
          <div>
            <label className="label">
              Number of Reactions
            </label>
            <input
              type="text"
              name="num_reactions"
              value={formData.num_reactions}
              onChange={handleChange}
              placeholder="1"
              className="input"
            />
          </div>

          {/* Other Parameters */}
          <div className="md:col-span-2">
            <label className="label">
              Other Parameters or Special Requirements
            </label>
            <textarea
              name="other_params"
              value={formData.other_params}
              onChange={handleChange}
              placeholder="e.g., GC-rich template, need high fidelity, specific annealing temperature..."
              className="textarea"
              rows="3"
            />
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
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Protocol</span>
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
              <Sparkles className="w-5 h-5 text-red-700" />
            </div>
            <div>
              <h3 className="font-semibold text-red-900 mb-1">
                Error Generating Protocol
              </h3>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Protocol Display */}
      {protocol && (
        <ProtocolDisplay protocol={protocol} title="Generated Protocol" />
      )}
    </div>
  );
};

export default GenerateProtocol;
