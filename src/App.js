import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './components/CSS/Login.css';
import loadingGif from './components/icon/loading-unscreen.gif';
import NFound from './components/icon/notFound.gif';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from '@vercel/speed-insights/react';

// PAGE
import Home from './components/pages/Home';
import Report from './components/pages/Reports/Report';
import Controller from './components/pages/Controller';
import Login from './components/pages/Login/Login';
import SignUp from './components/pages/Login/Register';

// Firebase Authentication
import { auth } from './components/firebase-config';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from 'react';

// PRIVATE ROUTE FUNCTION
function PrivateRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    const timeout = setTimeout(() => {
      if (loading) {
        setUser(null);
        setLoading(false);
      }
    }, 5000);

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, [loading]);

  if (loading) {
    return (
      <div className='con-loading'>
        <img src={loadingGif} alt="loading" className='loading' />
      </div>
    );
  }

  return user ? children : <Navigate to="/Login" replace />;
}

// LOGOUT FUNCTION
const logout = async () => {
  try {
    await signOut(auth);
    window.location.replace("/Login");
  } catch (error) {
    console.error("Error during logout", error);
  }
};

// NOT FOUND FUNCTION
function NotFound() {
  return (
    <div style={{ textAlign: 'center', color: 'gray', fontSize: '50px', marginTop: '20%' }} className='not-found'> 
      <img src={NFound} alt="Not Found" className='not-foundLogo' />
      404 Not Found
    </div>
  );
}

// APP FUNCTION
function App() {
  return (
    <Router>
      <SpeedInsights />
      <Analytics />
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route 
          path="/Home" 
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route 
          path="/Dashboard" 
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route 
          path="/Report" 
          element={
            <PrivateRoute>
              <Report />
            </PrivateRoute>
          }
        />
        <Route 
          path="/Controller" 
          element={
            <PrivateRoute>
              <Controller />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/Login" replace />} />
        <Route path="/Logout" element={<button onClick={logout}>Logout</button>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
