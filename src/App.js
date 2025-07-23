import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';
import Dashboard from './components/Dashboard';
import './style/login.css'; 
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
  return (
    <div className="loading-overlay">
      <div className="loading-container">
        {/* Modern spinner animation */}
        <div className="spinner">
          <div className="spinner-sector spinner-sector-red"></div>
          <div className="spinner-sector spinner-sector-blue"></div>
          <div className="spinner-sector spinner-sector-green"></div>
        </div>
        
        {/* Loading text with fade animation */}
        <div className="loading-text">
          <span className="loading-text-words">ریفرێژ</span>
          <span className="loading-text-words">دبیت</span>
          <span className="loading-text-words">چاڤەرێبە 😃 </span>
        </div>
        
        {/* Optional progress bar */}
        <div className="loading-progress">
          <div className="loading-progress-bar"></div>
        </div>
      </div>
    </div>
  );
}
  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
         <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} /> 
      </Routes>
    </Router>
  );
}

export default App;