import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import IMSGen from './pages/IMSGen';
import ProcureGen from './pages/ProcureGen';
import GenerateProtocol from './pages/GenerateProtocol';
import TroubleshootProtocol from './pages/TroubleshootProtocol';
import RouteGen from './pages/RouteGen';
import ToolGen from './pages/ToolGen';
import SavedResults from './pages/SavedResults';

// Minimal App - No auth, no Firebase, just pure functionality
function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/dashboard" element={<Layout><Home /></Layout>} />
        <Route path="/generate" element={<Layout><GenerateProtocol /></Layout>} />
        <Route path="/troubleshoot" element={<Layout><TroubleshootProtocol /></Layout>} />
        <Route path="/routes" element={<Layout><RouteGen /></Layout>} />
        <Route path="/tools" element={<Layout><ToolGen /></Layout>} />
        <Route path="/procure" element={<Layout><ProcureGen /></Layout>} />
        <Route path="/inventory" element={<Layout><IMSGen /></Layout>} />
        <Route path="/saved" element={<Layout><SavedResults /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
