const TestPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Proto-Gen Test Page</h1>
        <p className="text-slate-600 mb-4">
          If you can see this page, the basic React app is working.
        </p>
        <div className="space-y-2">
          <p className="text-sm text-slate-500">
            <strong>Status:</strong> App is loading correctly
          </p>
          <p className="text-sm text-slate-500">
            <strong>Timestamp:</strong> {new Date().toLocaleString()}
          </p>
        </div>
        <div className="mt-6">
          <a 
            href="/signin" 
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Go to Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
