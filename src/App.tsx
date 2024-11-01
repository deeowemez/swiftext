import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState } from "react";

import HomePage from './pages/HomePage';
import EditPage from './components/EditPage/EditPage';
import UploadPage from './pages/UploadPage';
import FilesPage from './pages/FilesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route 
          path="/edit/*" 
          element={<EditPage />} 
        />
        <Route
          path="/files"
          element={<FilesPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
