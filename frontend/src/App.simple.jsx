import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TestPage from './components/TestPage';

// Simple version without Firebase to test basic functionality
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TestPage />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </Router>
  );
}

export default App;
