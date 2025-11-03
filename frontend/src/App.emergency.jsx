import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import GenerateProtocol from './pages/GenerateProtocol';
import TroubleshootProtocol from './pages/TroubleshootProtocol';
import RouteGen from './pages/RouteGen';
import ToolGen from './pages/ToolGen';
import ProcureGen from './pages/ProcureGen';
import IMSGen from './pages/IMSGen';
import SavedResults from './pages/SavedResults';
import TestPage from './components/TestPage';

// Emergency App without any authentication - direct access to all features
function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <Routes>
        {/* Test Route */}
        <Route path="/test" element={<TestPage />} />
        
        {/* All routes without authentication */}
        <Route path="/" element={
          <Layout>
            <Home />
          </Layout>
        } />
        <Route path="/dashboard" element={
          <Layout>
            <Home />
          </Layout>
        } />
        <Route path="/generate" element={
          <Layout>
            <GenerateProtocol />
          </Layout>
        } />
        <Route path="/troubleshoot" element={
          <Layout>
            <TroubleshootProtocol />
          </Layout>
        } />
        <Route path="/routes" element={
          <Layout>
            <RouteGen />
          </Layout>
        } />
        <Route path="/tools" element={
          <Layout>
            <ToolGen />
          </Layout>
        } />
        <Route path="/procure" element={
          <Layout>
            <ProcureGen />
          </Layout>
        } />
        <Route path="/inventory" element={
          <Layout>
            <IMSGen />
          </Layout>
        } />
        <Route path="/saved" element={
          <Layout>
            <SavedResults />
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
