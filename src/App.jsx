import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminScreen from './views/AdminScreen';
import DisplayScreen from './views/DisplayScreen';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to admin */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        
        {/* The two distinct screens */}
        <Route path="/admin" element={<AdminScreen />} />
        <Route path="/display" element={<DisplayScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
