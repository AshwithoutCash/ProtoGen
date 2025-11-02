import { Link } from 'react-router-dom';
import { FileText, AlertCircle, Route, Monitor, Sparkles, Shield, Zap, BookOpen } from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Laboratory Assistant</span>
        </div>
        
        <h1 className="text-5xl font-bold text-gray-900">
          Welcome to Proto-Gen
        </h1>
        
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Generate detailed laboratory protocols and troubleshoot failed experiments 
          with the power of artificial intelligence. Save time, reduce errors, and 
          accelerate your research.
        </p>
      </div>

      {/* Main Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        <Link
          to="/generate"
          className="card hover:shadow-lg transition-shadow group"
        >
          <div className="flex items-start space-x-4">
            <div className="bg-primary-100 p-3 rounded-lg group-hover:bg-primary-200 transition-colors">
              <FileText className="w-6 h-6 text-primary-700" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Generate Protocol
              </h3>
              <p className="text-gray-600 mb-4">
                Create detailed, step-by-step laboratory protocols for PCR, Gibson Assembly, 
                Miniprep, and more. Get calculated reagent volumes and optimized conditions.
              </p>
              <span className="text-primary-600 font-medium group-hover:underline">
                Start generating →
              </span>
            </div>
          </div>
        </Link>

        <Link
          to="/troubleshoot"
          className="card hover:shadow-lg transition-shadow group"
        >
          <div className="flex items-start space-x-4">
            <div className="bg-amber-100 p-3 rounded-lg group-hover:bg-amber-200 transition-colors">
              <AlertCircle className="w-6 h-6 text-amber-700" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Troubleshoot Protocol
              </h3>
              <p className="text-gray-600 mb-4">
                Analyze failed experiments and get ranked suggestions for fixes. 
                Upload gel images and receive expert-level troubleshooting advice.
              </p>
              <span className="text-amber-600 font-medium group-hover:underline">
                Start troubleshooting →
              </span>
            </div>
          </div>
        </Link>

        <Link
          to="/routes"
          className="card hover:shadow-lg transition-shadow group"
        >
          <div className="flex items-start space-x-4">
            <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
              <Route className="w-6 h-6 text-green-700" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Route-Gen: Experiment Planner
              </h3>
              <p className="text-gray-600 mb-4">
                Plan complex multi-step experiments. Get 2-3 distinct experimental 
                routes with comparative analysis and direct protocol links.
              </p>
              <span className="text-green-600 font-medium group-hover:underline">
                Start planning →
              </span>
            </div>
          </div>
        </Link>

        <Link
          to="/tools"
          className="card hover:shadow-lg transition-shadow group"
        >
          <div className="flex items-start space-x-4">
            <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors">
              <Monitor className="w-6 h-6 text-purple-700" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tool-Gen: Computational Tools
              </h3>
              <p className="text-gray-600 mb-4">
                Get targeted software recommendations with step-by-step guides 
                and video tutorials for bioinformatics tasks.
              </p>
              <span className="text-purple-600 font-medium group-hover:underline">
                Find tools →
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Why Choose Proto-Gen?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card text-center">
            <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-primary-700" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Fast & Accurate
            </h3>
            <p className="text-gray-600">
              Generate protocols in seconds with precise calculations and 
              scientifically validated procedures.
            </p>
          </div>

          <div className="card text-center">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-green-700" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Expert Knowledge
            </h3>
            <p className="text-gray-600">
              Powered by AI trained on molecular biology best practices and 
              common laboratory techniques.
            </p>
          </div>

          <div className="card text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-purple-700" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Safety First
            </h3>
            <p className="text-gray-600">
              Includes notes on common pitfalls, safety considerations, and 
              quality control checkpoints.
            </p>
          </div>
        </div>
      </div>

      {/* Supported Techniques */}
      <div className="card max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Supported Techniques
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            'PCR',
            'qPCR',
            'Gibson Assembly',
            'Miniprep',
            'Gel Electrophoresis',
            'Restriction Digestion',
            'Ligation',
            'Transformation',
            'Western Blot',
            'ELISA',
            'And more...'
          ].map((technique) => (
            <div
              key={technique}
              className="bg-gray-50 px-3 py-2 rounded-lg text-sm text-gray-700 text-center"
            >
              {technique}
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="card max-w-4xl mx-auto bg-amber-50 border-amber-200">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-900 mb-2">
              Important Safety Notice
            </h3>
            <p className="text-sm text-amber-800">
              Proto-Gen is an AI assistant designed to help with protocol generation and 
              troubleshooting. It is <strong>not a substitute for expert scientific review</strong>. 
              Always verify protocols, calculations, and safety procedures with experienced 
              researchers before performing experiments. Follow your institution&apos;s safety 
              guidelines and consult relevant literature.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
