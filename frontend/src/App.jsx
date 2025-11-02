import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import GenerateProtocol from './pages/GenerateProtocol';
import TroubleshootProtocol from './pages/TroubleshootProtocol';
import RouteGen from './pages/RouteGen';
import ToolGen from './pages/ToolGen';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/generate" element={<GenerateProtocol />} />
          <Route path="/troubleshoot" element={<TroubleshootProtocol />} />
          <Route path="/routes" element={<RouteGen />} />
          <Route path="/tools" element={<ToolGen />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
