import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import ForgotPassword from './components/auth/ForgotPassword';
import Home from './pages/Home';
import GenerateProtocol from './pages/GenerateProtocol';
import TroubleshootProtocol from './pages/TroubleshootProtocol';
import RouteGen from './pages/RouteGen';
import ToolGen from './pages/ToolGen';
import ProcureGen from './pages/ProcureGen';
import IMSGen from './pages/IMSGen';
import SavedResults from './pages/SavedResults';
import TestPage from './components/TestPage';
import TestInventory from './pages/TestInventory';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <Routes>
            {/* Test Routes */}
            <Route path="/test" element={<TestPage />} />
            <Route path="/test-inventory" element={<TestInventory />} />
            
            {/* Public Routes */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Home />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Home />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/generate" element={
              <ProtectedRoute>
                <Layout>
                  <GenerateProtocol />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/troubleshoot" element={
              <ProtectedRoute>
                <Layout>
                  <TroubleshootProtocol />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/routes" element={
              <ProtectedRoute>
                <Layout>
                  <RouteGen />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/tools" element={
              <ProtectedRoute>
                <Layout>
                  <ToolGen />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/procure" element={
              <ProtectedRoute>
                <Layout>
                  <ProcureGen />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/inventory" element={
              <ProtectedRoute>
                <Layout>
                  <IMSGen />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/saved" element={
              <ProtectedRoute>
                <Layout>
                  <SavedResults />
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
