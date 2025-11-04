import { useState } from 'react';
import { Loader2, Route, Lightbulb } from 'lucide-react';
import { protocolAPI } from '../services/api';
import ProtocolDisplay from '../components/ProtocolDisplay';
import DNALoader from '../components/DNALoader';

const RouteGen = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [routes, setRoutes] = useState(null);
  
  const [formData, setFormData] = useState({
    overarching_goal: '',
    starting_material: '',
    target_organism: '',
    constraints: '',
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
    setRoutes(null);

    // Ensure minimum loading duration for better UX
    const startTime = Date.now();
    const minLoadingTime = 1500; // 1.5 seconds minimum

    try {
      const response = await protocolAPI.generateRoutes(formData);
      
      if (response.success) {
        setRoutes(response.routes);
      } else {
        setError(response.error || 'Failed to generate routes');
      }
    } catch (err) {
      console.error('Route generation error:', err);
      let errorMessage = 'An error occurred';
      
      if (err.response?.data?.detail) {
        // Handle FastAPI validation errors
        if (Array.isArray(err.response.data.detail)) {
          errorMessage = err.response.data.detail.map(e => e.msg || e).join(', ');
        } else if (typeof err.response.data.detail === 'string') {
          errorMessage = err.response.data.detail;
        } else {
          errorMessage = JSON.stringify(err.response.data.detail);
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      // Ensure minimum loading time has passed
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      
      setTimeout(() => {
        setLoading(false);
      }, remainingTime);
    }
  };


  return (
    <>
      <DNALoader 
        isVisible={loading} 
        message="Planning experimental routes for your research goal..." 
        overlay={true}
      />
      
      <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Route className="h-8 w-8 text-primary-600" />
          Route-Gen: Experiment Planner
        </h1>
        <p className="text-gray-600">
          Describe your complex scientific goal and get 2-3 distinct experimental routes 
          with step-by-step workflows, comparative analysis, and direct links to protocol generation.
        </p>
      </div>

      {/* Examples */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-900 mb-2">Example Goals:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• "Express and purify a His-tagged protein in E. coli"</li>
              <li>• "Create a stable CRISPR-Cas9 knockout cell line"</li>
              <li>• "Clone and validate a gene variant in mammalian cells"</li>
              <li>• "Develop a qPCR assay for pathogen detection"</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 space-y-6">
        {/* Overarching Goal */}
        <div>
          <label className="label">
            Overarching Scientific Goal *
          </label>
          <textarea
            name="overarching_goal"
            value={formData.overarching_goal}
            onChange={handleChange}
            placeholder="e.g., Express and purify a His-tagged protein in E. coli for structural studies"
            className="input min-h-[80px] resize-y"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Describe your main scientific objective that requires multiple experimental steps
          </p>
        </div>

        {/* Starting Material */}
        <div>
          <label className="label">
            Starting Material *
          </label>
          <input
            type="text"
            name="starting_material"
            value={formData.starting_material}
            onChange={handleChange}
            placeholder="e.g., Plasmid DNA, Mammalian genomic DNA, RNA from tissue biopsy"
            className="input"
            required
          />
        </div>

        {/* Target Organism */}
        <div>
          <label className="label">
            Target Organism/System *
          </label>
          <input
            type="text"
            name="target_organism"
            value={formData.target_organism}
            onChange={handleChange}
            placeholder="e.g., E. coli, HeLa cells, S. cerevisiae, Mouse tissue"
            className="input"
            required
          />
        </div>

        {/* Constraints */}
        <div>
          <label className="label">
            Constraints/Resources (Optional)
          </label>
          <textarea
            name="constraints"
            value={formData.constraints}
            onChange={handleChange}
            placeholder="e.g., Must be low-cost, Need to finish in 5 days, Limited access to specialized equipment"
            className="input min-h-[60px] resize-y"
          />
          <p className="text-sm text-gray-500 mt-1">
            Any limitations, time constraints, or resource requirements
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
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Route className="w-5 h-5" />
                <span>Generate Routes</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-medium text-red-900 mb-2">Error Generating Routes</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Routes Display */}
      {routes && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Generated Experimental Routes
            </h2>
          </div>
          
          <ProtocolDisplay 
            protocol={routes} 
            title="Experimental Routes"
            showCopy={true}
            showDownload={true}
          />
        </div>
      )}
      </div>
    </>
  );
};

export default RouteGen;
