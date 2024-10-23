import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState } from "react";

import HomePage from './pages/HomePage';
import EditPage from './components/EditPage/App';
import UploadPage from './pages/UploadPage';
import FilesPage from './pages/FilesPage';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route 
          path="/edit" 
          element={<EditPage selectedFile={selectedFile} setSelectedFile={setSelectedFile} />} 
        />
        <Route
          path="/files"
          element={<FilesPage selectedFile={selectedFile} setSelectedFile={setSelectedFile} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
