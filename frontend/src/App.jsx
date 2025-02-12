import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from "react";

import HomePage from './pages/HomePage';
import EditPage from './pages/EditPage';
import FilesPage from './pages/FilesPage';

function App() {
  const [user, setUser] = useState({});

  useEffect(() => {
    console.log('user details: ', user);
  }, [user]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <HomePage
            user={user}
            setUser={setUser}
          />} />
        <Route
          path="/edit/*"
          element={
            <EditPage
              user={user}
              setUser={setUser}
            />}
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
