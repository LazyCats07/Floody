import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Import Navigate for redirect
import './components/CSS/Login.css';

// PAGE
import Home from './components/pages/Home';
import Report from './components/pages/Reports/Report';
import Controller from './components/pages/Controller';
import Login from './components/pages/Login/Login';
import SignUp from './components/pages/Login/Register';

// Firebase Authentication
import { auth } from './components/firebase-config';
import { onAuthStateChanged } from "firebase/auth"; // Import Firebase auth state change listener
import { useEffect, useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // State for authentication status

  useEffect(() => {
    // Check the authentication status using Firebase
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true); // User is authenticated
      } else {
        setIsAuthenticated(false); // User is not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, []);

  // Render loading state while Firebase is checking the user status
  if (isAuthenticated === null) {
    return <div>Loading...</div>; // You can show a loading spinner or skeleton component
  }

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<SignUp />} />

          {/* Protected Routes */}
          <Route
            path="/Home"
            element={isAuthenticated ? <Home /> : <Navigate to="/Login" />}
          />
          <Route
            path="/"
            element={isAuthenticated ? <Home /> : <Navigate to="/Login" />}
          />
          <Route
            path="/Dashboard"
            element={isAuthenticated ? <Home /> : <Navigate to="/Login" />}
          />
          <Route
            path="/Report"
            element={isAuthenticated ? <Report /> : <Navigate to="/Login" />}
          />
          <Route
            path="/Controller"
            element={isAuthenticated ? <Controller /> : <Navigate to="/Login" />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
