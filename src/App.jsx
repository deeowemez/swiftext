import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState } from "react";

import HomePage from './pages/HomePage';
import EditPage from './components/EditPage/EditPage';
import UploadPage from './pages/UploadPage';
import FilesPage from './pages/FilesPage';

function App() {
  const [user, setUser] = useState({});
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <HomePage
            user={user}
            setUser={setUser}
          />} />
        <Route path="/upload" element={
          <UploadPage
            user={user}
            setUser={setUser}
          />} />
        <Route
          path="/edit/*"
          element={<EditPage />}
        />
        <Route
          path="/files"
          element={
            <FilesPage
              user={user}
              setUser={setUser}
            />}
        />
      </Routes>
    </Router>
  );
}

export default App;
