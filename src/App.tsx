import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Couplet from './pages/Couplet';
import Fortune from './pages/Fortune';
import Firecrackers from './pages/Firecrackers';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/couplet" element={<Couplet />} />
        <Route path="/fortune" element={<Fortune />} />
        <Route path="/firecrackers" element={<Firecrackers />} />
      </Routes>
    </Router>
  );
}

export default App;
