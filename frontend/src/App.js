import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard.js';
import VoiceSimulator from './pages/VoiceSimulator.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/voice" element={<VoiceSimulator />} />
      </Routes>
    </Router>
  );
}

export default App;
