import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddCard from './pages/AddCard';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/add-card" element={<AddCard />} />
        <Route path="/card-selection" element={<div>Card Selection Page</div>} />
      </Routes>
    </Router>
  );
};

export default App; 