import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import EditPage from './pages/EditPage';
import UploadPage from './pages/UploadPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/edit" element={<EditPage />} />
      </Routes>
    </Router>
  )
}

export default App;
